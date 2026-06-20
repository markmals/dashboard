# TV Show Genre Label — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)

## Goal

Give every TV show a broad, single-value genre — **Comedy** or **Drama** — auto-derived
from TMDb and rendered as an inline label in the TV grid, mirroring how movie cells display
their genre.

## Decisions (from brainstorming)

| Decision | Choice |
| --- | --- |
| Data model | Binary enum: `"Comedy"` \| `"Drama"` |
| Population | Auto-derived from TMDb during `refresh-tv.ts` |
| Override | Preserve-when-present escape hatch (sticky) |
| Collapse rule | **Drama wins ties** — Comedy only if tagged Comedy **and not** Drama |
| Display | Inline, genre last, movie-style: `5 seasons • Comedy` / `6/25/26 • Drama` |

## Changes

### 1. Schema — `app/content/config.server.ts`

Add a required `genre` field to `tvBase` so it applies to all four `status` variants of the
discriminated union:

```ts
const tvBase = z.object({
    title: z.string(),
    link: z.url(),
    genre: z.enum(["Comedy", "Drama"]),
    seasons: z.number().int().positive(),
    trailer: z.url().optional(),
    poster: z.url(),
    watching: z.boolean().default(false),
});
```

Required (not optional): every show has a TMDb link, so the refresh backfills all files —
matching how `status`/`seasons` are required and how the refresh "doubles as the initial
backfill." The build will not validate until the backfill has run (see Sequencing).

### 2. Auto-derivation — `scripts/refresh-tv.ts`

The existing `GET /tv/{id}` response (already fetched — **no extra API call**) includes a
`genres: [{ id, name }]` array. Add it to the `TmdbTv` interface, collapse it with the
Drama-wins-ties rule, and thread the result through `derive` / `Derived` / the rebuilt file
object.

```ts
type Genre = "Comedy" | "Drama";

// Comedy only if TMDb tags it Comedy and NOT also Drama; everything else is Drama.
function collapseGenre(genres: { name: string }[]): Genre {
    const names = new Set(genres.map(g => g.name));
    return names.has("Comedy") && !names.has("Drama") ? "Comedy" : "Drama";
}
```

**Override / preserve-when-present.** The rebuilt object uses the existing value when set,
otherwise the derived one:

```ts
genre: existing.genre ?? collapseGenre(tmdb.genres),
```

Consequences, stated honestly:
- A manually-set `genre` survives every refresh (the escape hatch).
- This makes `genre` **sticky**: once written (by backfill or by hand) a later re-run will
  **not** re-derive it from TMDb. Acceptable because comedy/drama is extremely stable on
  TMDb. To re-derive after a heuristic change, delete the field and re-run.
- Unlike `poster`, a divergence does **not** throw — the override silently wins. The poster
  hard-guarantee is unchanged.

`existing.genre` is added to the `TvShowFile` interface. Key order in the rebuilt file:
`title, link, genre, status, seasons, premiere?, trailer?, poster?, watching?` (genre placed
with the stable descriptors near `title`/`link`).

### 3. Display — `app/components/CollectionCells.tsx` (`TVShowCell`)

Two changes so the line matches the movie cell (genre is the trailing element):

1. `formatPremiere` switches to a compact numeric date and the `"Premieres "` prefix is
   dropped:
   ```ts
   // Local-date parts still used to avoid the UTC-midnight off-by-one.
   .toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })
   // 2026-06-25 -> "6/25/26"
   ```
2. The detail line appends genre last, bullet-separated:
   ```tsx
   const status = premiere
       ? formatPremiere(premiere)                                   // "6/25/26"
       : `${data.seasons} ${data.seasons === 1 ? "season" : "seasons"}`;
   const detail = `${status} • ${data.genre}`;                      // "5 seasons • Comedy"
   ```

The status `Badge` (Airing/Ended/Returning/Upcoming) and its layout are unchanged; only the
adjacent `<span>` text changes.

## Sequencing

The required schema field means files must carry `genre` before the app validates. Order:

1. Land the schema + refresh-script + display changes.
2. Run `mise run tv:refresh` to backfill `genre` into all ~42 TV JSON files.
3. Review the resulting classifications; hand-override any dramedies that landed on Drama but
   should read as Comedy (the override escape hatch). The Drama-wins rule is deliberately
   conservative, so expect to flip a handful (likely candidates: *Atlanta*, *Reservation
   Dogs*, *Shrinking*, *Beef*, possibly *The Bear*).

## Verification

- `mise run tv:refresh` succeeds and writes `genre` to every file.
- `mise run typecheck` passes (script + schema + component types).
- `mise run build` passes (Zod validation of all TV data files).
- Visual check of the TV grid: each cell reads `<status badge> <detail> • <genre>`.

## Out of scope

- Sorting or filtering by genre.
- Genre on movies (already exists, freeform; unchanged).
- More than two genre values, or multi-genre per show.
