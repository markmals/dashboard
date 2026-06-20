import type { SortOption } from "~/lib/collections.ts";
import type { CollectionEntry } from "~/lib/content-types.ts";

import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection } from "sprinkles:content";

import { MovieCell } from "~/components/CollectionCells.tsx";
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
import { releaseSortComparator, titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

type TheaterData = CollectionEntry<"theaters">["data"];

const THEATER_SORTS = {
    title: { label: "Title (A–Z)", compare: titleSortComparator },
    "release-asc": { label: "Release (soonest)", compare: releaseSortComparator },
    "release-desc": {
        label: "Release (latest)",
        compare: (lhs, rhs) => releaseSortComparator(rhs, lhs),
    },
} satisfies Record<string, SortOption<TheaterData>>;

export async function ServerComponent() {
    let params = getSearchParams();
    let sort = pickSort(THEATER_SORTS, params.get("sort"), "title");
    let genre = params.get("genre") ?? "";

    let movies = await getCollection("theaters");
    let formatter = new Intl.DateTimeFormat("en", { dateStyle: "short" });
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only surface fully-hydrated entries; upcoming titles without a poster on TMDb yet are kept
    // in the data file but hidden until those fields can be filled in.
    let complete = movies.filter(movie => movie.data.poster);
    let visible = complete.filter(movie => matchesGenre(movie.data.genre, genre));
    let comparator = withContent(THEATER_SORTS[sort].compare);

    let inTheaters = visible
        .filter(movie => new Date(`${movie.data.release}T00:00:00`) <= today)
        .toSorted(comparator)
        .map(movie => ({
            ...movie,
            data: {
                ...movie.data,
                release: null as unknown as string,
            },
        }));

    let upcoming = visible
        .filter(movie => new Date(`${movie.data.release}T00:00:00`) > today)
        .toSorted(comparator)
        .map(movie => ({
            ...movie,
            data: {
                ...movie.data,
                release: formatter.format(new Date(`${movie.data.release}T00:00:00`)),
            },
        }));

    let canReset = sort !== "title" || genre !== "";

    return (
        <>
            <title>Theater Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <CollectionControls
                    canReset={canReset}
                    controls={[
                        {
                            name: "sort",
                            label: "Sort by",
                            value: sort,
                            options: sortControlOptions(THEATER_SORTS),
                        },
                        {
                            name: "genre",
                            label: "Genre",
                            value: genre,
                            options: genreControlOptions(complete.map(movie => movie.data.genre)),
                        },
                    ]}
                    resetTo="/in-theaters"
                />
                {inTheaters.length > 0 && (
                    <>
                        <SectionHeader>In Theaters</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {inTheaters.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
                {upcoming.length > 0 && (
                    <>
                        <SectionHeader>Upcoming</SectionHeader>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                            {upcoming.map(movie => (
                                <MovieCell key={movie.data.link} movie={movie} />
                            ))}
                        </ul>
                    </>
                )}
                {inTheaters.length === 0 && upcoming.length === 0 && (
                    <EmptyState className="py-12">
                        <EmptyStateIcon>
                            <Icon name="search" size={48} />
                        </EmptyStateIcon>
                        <EmptyStateHeading>No movies match</EmptyStateHeading>
                        <EmptyStateDescription>
                            Try a different genre, or reset the filters.
                        </EmptyStateDescription>
                    </EmptyState>
                )}
            </div>
        </>
    );
}
