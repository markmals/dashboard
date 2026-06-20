import type { SortOption } from "~/lib/collections.ts";
import type { CollectionEntry } from "~/lib/content-types.ts";

import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection } from "sprinkles:content";

import { TVShowCell } from "~/components/CollectionCells.tsx";
import { CollectionControls } from "~/components/CollectionControls.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import {
    genreControlOptions,
    getSearchParams,
    matchesGenre,
    pickSort,
    sortControlOptions,
} from "~/lib/collections.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

type TvData = CollectionEntry<"television">["data"];

// Section order for the status sort: airing first, then upcoming, returning, ended.
const STATUS_ORDER = { airing: 0, upcoming: 1, returning: 2, ended: 3 } as const;
// Statuses without a premiere share this sentinel so they fall through to the title tiebreak.
const NO_PREMIERE = "9999-99-99";

const TV_STATUSES = [
    { value: "airing", label: "Airing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "returning", label: "Returning" },
    { value: "ended", label: "Ended" },
];

function premiereKey(data: TvData): string {
    return ("premiere" in data ? data.premiere : undefined) ?? NO_PREMIERE;
}

const TV_SORTS = {
    status: {
        label: "Status",
        // Airing → upcoming → returning → ended; within a status, dated premieres first, then title.
        compare: (lhs, rhs) =>
            STATUS_ORDER[lhs.status] - STATUS_ORDER[rhs.status] ||
            premiereKey(lhs).localeCompare(premiereKey(rhs)) ||
            titleSortComparator(lhs, rhs),
    },
    title: { label: "Title (A–Z)", compare: titleSortComparator },
    "seasons-desc": { label: "Seasons (most)", compare: (lhs, rhs) => rhs.seasons - lhs.seasons },
    "seasons-asc": { label: "Seasons (fewest)", compare: (lhs, rhs) => lhs.seasons - rhs.seasons },
} satisfies Record<string, SortOption<TvData>>;

export async function ServerComponent() {
    let params = getSearchParams();
    let sort = pickSort(TV_SORTS, params.get("sort"), "status");
    let status = params.get("status") ?? "";
    let genre = params.get("genre") ?? "";

    let all = await getCollection("television");
    let shows = all
        .filter(
            show =>
                (status === "" || show.data.status === status) &&
                matchesGenre(show.data.genre, genre),
        )
        .toSorted(withContent(TV_SORTS[sort].compare));

    let watching = shows.filter(show => show.data.watching);
    let tvShows = shows.filter(show => !show.data.watching);

    let canReset = sort !== "status" || status !== "" || genre !== "";

    return (
        <>
            <title>TV Shows • Dashboard</title>
            <div className="flex flex-col gap-10">
                <CollectionControls
                    canReset={canReset}
                    controls={[
                        {
                            name: "sort",
                            label: "Sort by",
                            value: sort,
                            options: sortControlOptions(TV_SORTS),
                        },
                        {
                            name: "status",
                            label: "Status",
                            value: status,
                            options: [{ value: "", label: "All statuses" }, ...TV_STATUSES],
                        },
                        {
                            name: "genre",
                            label: "Genre",
                            value: genre,
                            options: genreControlOptions(all.map(show => show.data.genre)),
                        },
                    ]}
                    resetTo="/tv"
                />
                {watching.length > 0 && (
                    <>
                        <SectionHeader>Watching</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {watching.map(show => (
                                <TVShowCell key={show.data.title} tvShow={show} />
                            ))}
                        </ul>
                    </>
                )}
                {tvShows.length > 0 && (
                    <>
                        <SectionHeader>All Shows</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 pb-12 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {tvShows.map(show => (
                                <TVShowCell key={show.data.title} tvShow={show} />
                            ))}
                        </ul>
                    </>
                )}
                {shows.length === 0 && (
                    <EmptyState className="py-12">
                        <EmptyStateIcon>
                            <Icon name="search" size={48} />
                        </EmptyStateIcon>
                        <EmptyStateHeading>No shows match</EmptyStateHeading>
                        <EmptyStateDescription>
                            Try a different status or genre, or reset the filters.
                        </EmptyStateDescription>
                    </EmptyState>
                )}
            </div>
        </>
    );
}
