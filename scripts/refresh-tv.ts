// Re-hydrates the volatile TMDb-derived fields on each TV show data file:
//   - status   (ended | airing | returning | upcoming)
//   - seasons  (number_of_seasons)
//   - premiere (ISO date — the next premiere date; present only on `upcoming` shows)
//   - finale   (ISO date — last scheduled episode of the current/next season; airing + upcoming
//               shows only, and only once TMDb has the season's full schedule)
//
// Everything else (title, link, trailer, poster, watching) is preserved as-is,
// including manually-added posters and the `watching` flag. Doubles as the
// initial backfill. Run via `mise run tv:refresh` (which injects TMDB_API_KEY).

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TV_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "app", "content", "television");
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
    console.error("TMDB_API_KEY is not set. Run via `mise run tv:refresh`.");
    process.exit(1);
}

let _today = new Date().toISOString().slice(0, 10);

type TvStatus = "ended" | "airing" | "returning" | "upcoming";

interface TmdbEpisode {
    air_date: string | null;
    season_number: number;
    episode_number: number;
}

interface TmdbTv {
    status: string;
    number_of_seasons: number;
    first_air_date: string | null;
    last_episode_to_air: TmdbEpisode | null;
    next_episode_to_air: TmdbEpisode | null;
    genres: { id: number; name: string }[];
}

type Genre = "Comedy" | "Drama" | "Documentary";

// A show's genre may be a single label or a list of them. Multi-genre shows (e.g. dramedies
// tagged both Comedy and Drama) are stored as an array; the field is preserved verbatim.
type GenreField = Genre | Genre[];

interface Derived {
    status: TvStatus;
    seasons: number;
    premiere?: string;
    genre: Genre;
    // The season whose finale date should be looked up (the season now airing, or the one about
    // to premiere). Absent for ended/returning shows, which have no season in flight.
    finaleSeason?: number;
}

interface TvShowFile {
    title: string;
    link: string;
    genre?: GenreField;
    status?: TvStatus;
    seasons?: number;
    premiere?: string;
    finale?: string;
    trailer?: string;
    poster?: string;
    watching?: boolean;
}

/**
 * Collapse TMDb's multi-genre array into a single broad label. Drama wins ties: a show is
 * only "Comedy" if TMDb tags it Comedy and NOT also Drama (so dramedies like The Bear land
 * on Drama). Everything else is Drama.
 */
function collapseGenre(genres: { name: string }[]): Genre {
    let names = new Set(genres.map(g => g.name));
    return names.has("Comedy") && !names.has("Drama") ? "Comedy" : "Drama";
}

/** Map TMDb status + episode dates to our normalized airing state. */
function derive(tv: TmdbTv): Derived {
    let seasons = tv.number_of_seasons;
    let firstAir = tv.first_air_date || null;
    let last = tv.last_episode_to_air || null;
    let next = tv.next_episode_to_air || null;
    let genre = collapseGenre(tv.genres);

    if (tv.status === "Ended" || tv.status === "Canceled") {
        return { status: "ended", seasons, genre };
    }
    // Airing: a season is currently mid-release — an episode has aired and the next scheduled
    // episode is in the SAME season. (A next episode in a later season is a future premiere,
    // handled below as `upcoming`.)
    if (last && next && last.season_number === next.season_number) {
        return { status: "airing", seasons, genre, finaleSeason: next.season_number };
    }
    // Otherwise the show is brand-new (nothing aired yet) or between seasons. The next premiere
    // date is the first air date for a show that hasn't started, or the next episode's air date
    // for a returning one. With a known date it's `upcoming`; without one, `returning`.
    let premiere = last ? next?.air_date : firstAir;
    if (premiere) {
        return {
            status: "upcoming",
            seasons,
            premiere,
            genre,
            finaleSeason: next?.season_number ?? 1,
        };
    }
    return { status: "returning", seasons, genre };
}

const TV_ID_RE = /\/tv\/(\d+)/;

function tmdbId(link: string | undefined): string {
    let match = TV_ID_RE.exec(link ?? "");
    if (!match) throw new Error(`Could not parse TMDb id from link: ${link}`);
    return match[1];
}

/**
 * The air date of a season's last episode, or undefined while TMDb lacks the full schedule
 * (season not yet listed, no episodes, or the closing episodes still undated).
 */
async function seasonFinale(id: string, season: number): Promise<string | undefined> {
    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}`,
    );
    if (!res.ok) return undefined;
    let { episodes } = (await res.json()) as { episodes?: TmdbEpisode[] };
    if (!episodes || episodes.length === 0) return undefined;
    let last = episodes.reduce((a, b) => (b.episode_number > a.episode_number ? b : a));
    return last.air_date ?? undefined;
}

let files = (await readdir(TV_DIR)).filter(f => f.endsWith(".json")).sort();
let changed = 0;

for (let file of files) {
    let path = join(TV_DIR, file);
    let raw = await readFile(path, "utf8");
    let existing = JSON.parse(raw) as TvShowFile;
    let id = tmdbId(existing.link);

    let res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    if (!res.ok) {
        console.error(`✗ ${file}: TMDb ${res.status}`);
        continue;
    }
    let derived = derive((await res.json()) as TmdbTv);
    let { status, seasons, premiere, finaleSeason, genre: derivedGenre } = derived;
    let finale = finaleSeason === undefined ? undefined : await seasonFinale(id, finaleSeason);
    // `genre` is preserve-when-present: an existing value (manual override or a prior backfill)
    // wins, otherwise we use the freshly-derived label. This makes genre sticky — once written
    // it is not re-derived on later refreshes. To re-derive, delete the field and re-run.
    let genre = existing.genre ?? derivedGenre;

    // Rebuild in a stable key order, preserving everything not derived here. This script writes
    // status/seasons/premiere/finale every run and backfills genre once; title/link/trailer/poster/
    // watching are carried over from disk verbatim and are never sourced from TMDb. `poster` in
    // particular is hand-curated — see the invariant below.
    let updated: TvShowFile = {
        title: existing.title,
        link: existing.link,
        genre,
        status,
        seasons,
        ...(premiere ? { premiere } : {}),
        ...(finale ? { finale } : {}),
        ...(existing.trailer ? { trailer: existing.trailer } : {}),
        ...(existing.poster ? { poster: existing.poster } : {}),
        ...(existing.watching !== undefined ? { watching: existing.watching } : {}),
    };

    // Hard guarantee: poster data is hand-curated and must never be clobbered by this
    // script. If a future edit ever changes (or drops) a poster, fail loudly instead of
    // overwriting it on disk.
    if (updated.poster !== existing.poster) {
        throw new Error(
            `refresh-tv refuses to modify the hand-curated poster for ${file} ` +
                `(was ${existing.poster ?? "<none>"}, would become ${updated.poster ?? "<none>"})`,
        );
    }

    // `JSON.stringify` with indentation expands arrays across multiple lines. Keep the short
    // `genre` array inline (e.g. `["Comedy", "Drama"]`) to match the hand-authored convention
    // and avoid gratuitous reformatting churn. Values are a closed set of simple labels, so a
    // targeted collapse is safe; single-string genres have no `[` and are left untouched.
    let next = `${JSON.stringify(updated, null, 4)}\n`.replace(
        /("genre": )\[\n((?:\s+"[^"]+",?\n)+)\s+\]/,
        (_, key, body) => `${key}[${(body.match(/"[^"]+"/g) ?? []).join(", ")}]`,
    );
    if (next !== raw) changed++;
    await writeFile(path, next);

    let detail = premiere
        ? `premieres ${premiere}${finale ? ` (thru ${finale})` : ""}`
        : finale
          ? `finale ${finale}`
          : `${seasons} season(s)`;
    let genreLabel = Array.isArray(genre) ? genre.join("/") : genre;
    console.log(`✓ ${file.padEnd(40)} ${genreLabel.padEnd(11)} ${status.padEnd(10)} ${detail}`);
}

console.log(`\n${files.length} files processed, ${changed} updated.`);
