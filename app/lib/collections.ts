import { sortBy } from "es-toolkit/array";
import { cache } from "react";
import { href, unstable_getRequest as getRequest } from "react-router";

import { readPrefs } from "~/lib/prefs.ts";

// A single `<Select>` option rendered by `CollectionControls`.
export interface ControlOption {
    value: string;
    label: string;
}

// A sort entry: a human label plus es-toolkit `sortBy` criteria over a collection's `data`. Criteria
// sort ascending and are applied in order (ties fall through to the next); express a descending sort
// by negating a numeric/date criterion (`d => -d.seasons`), since `sortBy` has no direction.
export interface SortOption<T> {
    label: string;
    criteria: Array<(data: T) => unknown>;
}

const ARTICLES_RE = /^(?:a|an|the)\s+/i;

// Article-, accent-, and case-insensitive key for title/name sorts. `sortBy` compares strings by
// code point (no `localeCompare`), so we normalize here to approximate "base" sensitivity. Note this
// drops `localeCompare`'s numeric/ignore-punctuation handling — fine for these title/name datasets.
export function titleKey(value: string): string {
    return value
        .replace(ARTICLES_RE, "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
}

// Sort collection entries with es-toolkit `sortBy`, applying each criterion to the entry's `data`.
export function sortEntries<E extends { data: object }>(
    entries: readonly E[],
    option: SortOption<E["data"]>,
): E[] {
    return sortBy(
        entries,
        option.criteria.map(criterion => (entry: E) => criterion(entry.data)),
    );
}

// Request-scoped accessors over the per-request globals. `unstable_getRequest` is populated for the
// whole RSC render (react-router runs it inside its `ServerStorage` async context; needs the
// `nodejs_als` Worker flag), and `React.cache` dedupes these within a single render so the URL is
// parsed once and the prefs cookie read at most once per request.
let requestUrl = cache(() => new URL(getRequest().url));
let requestPrefs = cache(() => readPrefs(getRequest()));

// Effective sort/filter params for a collection page: just the URL's search params. The URL is now
// authoritative — a bare URL renders defaults (a reset). Remembered params aren't restored here;
// they're carried into in-app links by `restoredHref`.
export function resolvePageParams(): URLSearchParams {
    return requestUrl().searchParams;
}

// Type-safe `href()` that bakes in a collection page's remembered sort/filter params so in-app links
// preserve them (bare URLs reset instead of redirect-restoring). The current page mirrors the live
// URL so its own nav link never lags a render; every other page uses its stored prefs entry, falling
// back to the plain path when nothing is remembered. Server-only (reads the request-scoped prefs).
export async function restoredHref(...args: Parameters<typeof href>): Promise<string> {
    let path = href(...args);
    let url = requestUrl();
    if (path === url.pathname) return `${path}${url.search}`;
    let prefs = await requestPrefs();
    return prefs[path] ? `${path}?${prefs[path]}` : path;
}

// Narrow a raw `?sort=` value to a known registry key, falling back to the default.
export function pickSort<R extends Record<string, unknown>>(
    sorts: R,
    value: string | null,
    fallback: Extract<keyof R, string>,
): Extract<keyof R, string> {
    return value !== null && value in sorts ? (value as Extract<keyof R, string>) : fallback;
}

// Build `<Select>` options from a sort registry, preserving its definition order.
export function sortControlOptions(sorts: Record<string, { label: string }>): ControlOption[] {
    return Object.entries(sorts).map(([value, option]) => ({ value, label: option.label }));
}

// Movie/theater `genre` is one order-variant compound string ("Drama, Comedy" and "Comedy, Drama"
// both occur in the data); TV `genre` is an enum or an array of them. Normalize all of it to a list
// of individual tags so the genre filter is a deduplicated set and matching is order-independent.
export function splitGenres(genre: string | readonly string[]): string[] {
    let parts = typeof genre === "string" ? genre.split(",") : genre;
    return parts.map(part => part.trim()).filter(Boolean);
}

// The sorted union of genre tags across a collection, as filter options (an "All" entry prepended).
export function genreControlOptions(
    genres: Iterable<string | readonly string[]>,
    allLabel = "All genres",
): ControlOption[] {
    let tags = new Set<string>();
    for (let genre of genres) {
        for (let tag of splitGenres(genre)) tags.add(tag);
    }
    let sorted = [...tags].sort((lhs, rhs) => lhs.localeCompare(rhs));
    return [{ value: "", label: allLabel }, ...sorted.map(tag => ({ value: tag, label: tag }))];
}

// An empty selection ("All genres") matches everything; otherwise the entry must carry the tag.
export function matchesGenre(genre: string | readonly string[], selected: string): boolean {
    return selected === "" || splitGenres(genre).includes(selected);
}

// Parse a "2h 20m" running time to minutes for sorting; missing/unparseable values sort last.
export function runtimeMinutes(runningTime: string | undefined): number {
    if (!runningTime) return Number.POSITIVE_INFINITY;
    let hours = /(\d+)\s*h/.exec(runningTime);
    let minutes = /(\d+)\s*m/.exec(runningTime);
    if (!hours && !minutes) return Number.POSITIVE_INFINITY;
    return (hours ? Number(hours[1]) : 0) * 60 + (minutes ? Number(minutes[1]) : 0);
}
