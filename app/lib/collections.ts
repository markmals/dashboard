import { unstable_getRequest as getRequest } from "react-router";

// A single `<Select>` option rendered by `CollectionControls`.
export interface ControlOption {
    value: string;
    label: string;
}

// A sort entry: a human label plus a comparator over a collection's `data`.
export interface SortOption<T> {
    label: string;
    compare: (lhs: T, rhs: T) => number;
}

// Read the current request's query string from inside an RSC server component. `unstable_getRequest`
// is populated for the whole route render (react-router runs the RSC render inside its
// `ServerStorage` async context), so this is the RSC-native counterpart to a loader's
// `request.url` — no loader or middleware required. Requires the `nodejs_als` Worker flag.
export function getSearchParams(): URLSearchParams {
    return new URL(getRequest().url).searchParams;
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
