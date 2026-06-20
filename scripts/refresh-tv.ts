// Re-hydrates the volatile TMDb-derived fields on each TV show data file:
//   - status   (ended | airing | returning | upcoming)
//   - seasons  (number_of_seasons)
//   - premiere (ISO date — the next premiere date; present only on `upcoming` shows)
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

type Genre = "Comedy" | "Drama";

interface Derived {
    status: TvStatus;
    seasons: number;
    premiere?: string;
    genre: Genre;
}

interface TvShowFile {
    title: string;
    link: string;
    genre?: Genre;
    status?: TvStatus;
    seasons?: number;
    premiere?: string;
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
        return { status: "airing", seasons, genre };
    }
    // Otherwise the show is brand-new (nothing aired yet) or between seasons. The next premiere
    // date is the first air date for a show that hasn't started, or the next episode's air date
    // for a returning one. With a known date it's `upcoming`; without one, `returning`.
    let premiere = last ? next?.air_date : firstAir;
    if (premiere) {
        return { status: "upcoming", seasons, premiere, genre };
    }
    return { status: "returning", seasons, genre };
}

const TV_ID_RE = /\/tv\/(\d+)/;

function tmdbId(link: string | undefined): string {
    let match = TV_ID_RE.exec(link ?? "");
    if (!match) throw new Error(`Could not parse TMDb id from link: ${link}`);
    return match[1];
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
    let { status, seasons, premiere, genre: derivedGenre } = derive((await res.json()) as TmdbTv);
    // `genre` is preserve-when-present: an existing value (manual override or a prior backfill)
    // wins, otherwise we use the freshly-derived label. This makes genre sticky — once written
    // it is not re-derived on later refreshes. To re-derive, delete the field and re-run.
    let genre = existing.genre ?? derivedGenre;

    // Rebuild in a stable key order, preserving everything not derived here. This script writes
    // status/seasons/premiere every run and backfills genre once; title/link/trailer/poster/
    // watching are carried over from disk verbatim and are never sourced from TMDb. `poster` in
    // particular is hand-curated — see the invariant below.
    let updated: TvShowFile = {
        title: existing.title,
        link: existing.link,
        genre,
        status,
        seasons,
        ...(premiere ? { premiere } : {}),
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

    let next = `${JSON.stringify(updated, null, 4)}\n`;
    if (next !== raw) changed++;
    await writeFile(path, next);

    let detail = premiere ? `premieres ${premiere}` : `${seasons} season(s)`;
    console.log(`✓ ${file.padEnd(40)} ${genre.padEnd(7)} ${status.padEnd(10)} ${detail}`);
}

console.log(`\n${files.length} files processed, ${changed} updated.`);
