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

/** Map TMDb status + episode dates to our normalized airing state. */
function derive(tv) {
    const seasons = tv.number_of_seasons;
    const firstAir = tv.first_air_date || null;
    const lastEp = tv.last_episode_to_air?.air_date || null;
    const nextEp = tv.next_episode_to_air?.air_date || null;

    if (tv.status === "Ended" || tv.status === "Canceled") {
        return { status: "ended", seasons };
    }
    // Not yet premiered: nothing has aired, or the first air date is still in the future.
    if (firstAir && (!lastEp || firstAir > today)) {
        return { status: "upcoming", seasons, premiere: firstAir };
    }
    if (nextEp) return { status: "airing", seasons };
    return { status: "returning", seasons };
}

const TV_ID_RE = /\/tv\/(\d+)/;

function tmdbId(link) {
    const match = TV_ID_RE.exec(link ?? "");
    if (!match) throw new Error(`Could not parse TMDb id from link: ${link}`);
    return match[1];
}

const files = (await readdir(TV_DIR)).filter(f => f.endsWith(".json")).sort();
let changed = 0;

for (const file of files) {
    const path = join(TV_DIR, file);
    const existing = JSON.parse(await readFile(path, "utf8"));
    const id = tmdbId(existing.link);

    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    if (!res.ok) {
        console.error(`✗ ${file}: TMDb ${res.status}`);
        continue;
    }
    const { status, seasons, premiere } = derive(await res.json());

    // Rebuild in a stable key order, preserving everything not derived here.
    const updated = {
        title: existing.title,
        link: existing.link,
        status,
        seasons,
        ...(premiere ? { premiere } : {}),
        ...(existing.trailer ? { trailer: existing.trailer } : {}),
        ...(existing.poster ? { poster: existing.poster } : {}),
        ...(existing.watching !== undefined ? { watching: existing.watching } : {}),
    };

    const next = `${JSON.stringify(updated, null, 4)}\n`;
    if (next !== (await readFile(path, "utf8"))) changed++;
    await writeFile(path, next);

    const detail = premiere ? `premieres ${premiere}` : `${seasons} season(s)`;
    console.log(`✓ ${file.padEnd(40)} ${status.padEnd(10)} ${detail}`);
}

console.log(`\n${files.length} files processed, ${changed} updated.`);
