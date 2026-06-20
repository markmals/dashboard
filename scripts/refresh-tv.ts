// Re-hydrates the volatile TMDb-derived fields on each TV show data file:
//   - status   (ended | airing | returning | upcoming)
//   - seasons  (number_of_seasons)
//   - premiere (ISO date, only when upcoming)
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

const today = new Date().toISOString().slice(0, 10);

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
}

interface Derived {
    status: TvStatus;
    seasons: number;
    premiere?: string;
}

interface TvShowFile {
    title: string;
    link: string;
    status?: TvStatus;
    seasons?: number;
    premiere?: string;
    trailer?: string;
    poster?: string;
    watching?: boolean;
}

/** Map TMDb status + episode dates to our normalized airing state. */
function derive(tv: TmdbTv): Derived {
    const seasons = tv.number_of_seasons;
    const firstAir = tv.first_air_date || null;
    const last = tv.last_episode_to_air || null;
    const next = tv.next_episode_to_air || null;

    if (tv.status === "Ended" || tv.status === "Canceled") {
        return { status: "ended", seasons };
    }
    // Not yet premiered: nothing has aired, or the first air date is still in the future.
    if (firstAir && (!last || firstAir > today)) {
        return { status: "upcoming", seasons, premiere: firstAir };
    }
    // Airing ONLY when a season is currently mid-release: an episode has already aired and
    // the next scheduled episode is in the SAME season. A next episode in a later season is
    // an upcoming season premiere, not new episodes dropping now → that's `returning`.
    if (last && next && last.season_number === next.season_number) {
        return { status: "airing", seasons };
    }
    return { status: "returning", seasons };
}

const TV_ID_RE = /\/tv\/(\d+)/;

function tmdbId(link: string | undefined): string {
    const match = TV_ID_RE.exec(link ?? "");
    if (!match) throw new Error(`Could not parse TMDb id from link: ${link}`);
    return match[1];
}

const files = (await readdir(TV_DIR)).filter(f => f.endsWith(".json")).sort();
let changed = 0;

for (const file of files) {
    const path = join(TV_DIR, file);
    const raw = await readFile(path, "utf8");
    const existing = JSON.parse(raw) as TvShowFile;
    const id = tmdbId(existing.link);

    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    if (!res.ok) {
        console.error(`✗ ${file}: TMDb ${res.status}`);
        continue;
    }
    const { status, seasons, premiere } = derive((await res.json()) as TmdbTv);

    // Rebuild in a stable key order, preserving everything not derived here. This script
    // ONLY ever writes status/seasons/premiere; title/link/trailer/poster/watching are
    // carried over from disk verbatim and are never sourced from TMDb. `poster` in
    // particular is hand-curated — see the invariant below.
    const updated: TvShowFile = {
        title: existing.title,
        link: existing.link,
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

    const next = `${JSON.stringify(updated, null, 4)}\n`;
    if (next !== raw) changed++;
    await writeFile(path, next);

    const detail = premiere ? `premieres ${premiere}` : `${seasons} season(s)`;
    console.log(`✓ ${file.padEnd(40)} ${status.padEnd(10)} ${detail}`);
}

console.log(`\n${files.length} files processed, ${changed} updated.`);
