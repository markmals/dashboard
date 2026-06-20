import { sortBy } from "es-toolkit/array";

import { TVShowCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { removeArticles } from "~/lib/sort-comparators.ts";

import type { Route } from "./+types/tv";

// Section order for the TV grid: airing first, then upcoming, returning, ended.
const STATUS_ORDER = { airing: 0, upcoming: 1, returning: 2, ended: 3 } as const;

// Shared sort key for statuses without a premiere date, so they fall through to the title key.
const NO_PREMIERE = "9999-99-99";

// Accent- and case-insensitive title key, since `sortBy` compares by code point rather than
// locale. Mirrors the article-stripping, base-sensitivity behavior of `titleSortComparator`.
const titleKey = (title: string) =>
    removeArticles(title)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

export async function loader() {
    const tvShows = sortBy(await getCollection("television"), [
        show => STATUS_ORDER[show.data.status],
        // Only `upcoming` shows carry a premiere; order them by it (ISO strings compare
        // chronologically). Other statuses share the sentinel and fall through to the title key.
        show => ("premiere" in show.data ? show.data.premiere : undefined) ?? NO_PREMIERE,
        show => titleKey(show.data.title),
    ]);

    return {
        tvShows: tvShows.filter(show => !show.data.watching),
        watching: tvShows.filter(show => show.data.watching),
    };
}

export default function Component({ loaderData }: Route.ComponentProps) {
    const { tvShows, watching } = loaderData;
    return (
        <>
            <title>TV Shows • Dashboard</title>
            <div className="flex flex-col gap-10">
                {Boolean(watching.length) && (
                    <>
                        <SectionHeader>Watching</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {watching.map(show => (
                                <TVShowCell key={show.data.title} tvShow={show} />
                            ))}
                        </ul>
                    </>
                )}
                {Boolean(tvShows.length) && (
                    <>
                        <SectionHeader>All Shows</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 pb-12 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {tvShows.map(show => (
                                <TVShowCell key={show.data.title} tvShow={show} />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
