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
    runtimeMinutes,
    sortControlOptions,
} from "~/lib/collections.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

type MovieData = CollectionEntry<"movies">["data"];

const MOVIE_SORTS = {
    title: { label: "Title (A–Z)", compare: titleSortComparator },
    "year-desc": {
        label: "Year (newest)",
        compare: (lhs, rhs) => Number(rhs.year) - Number(lhs.year),
    },
    "year-asc": {
        label: "Year (oldest)",
        compare: (lhs, rhs) => Number(lhs.year) - Number(rhs.year),
    },
    "runtime-desc": {
        label: "Runtime (longest)",
        compare: (lhs, rhs) => runtimeMinutes(rhs.runningTime) - runtimeMinutes(lhs.runningTime),
    },
    "runtime-asc": {
        label: "Runtime (shortest)",
        compare: (lhs, rhs) => runtimeMinutes(lhs.runningTime) - runtimeMinutes(rhs.runningTime),
    },
} satisfies Record<string, SortOption<MovieData>>;

export async function ServerComponent() {
    let params = getSearchParams();
    let sort = pickSort(MOVIE_SORTS, params.get("sort"), "title");
    let genre = params.get("genre") ?? "";

    let all = await getCollection("movies");
    let movies = all
        .filter(movie => matchesGenre(movie.data.genre, genre))
        .toSorted(withContent(MOVIE_SORTS[sort].compare));

    let canReset = sort !== "title" || genre !== "";

    return (
        <>
            <title>Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <CollectionControls
                    canReset={canReset}
                    controls={[
                        {
                            name: "sort",
                            label: "Sort by",
                            value: sort,
                            options: sortControlOptions(MOVIE_SORTS),
                        },
                        {
                            name: "genre",
                            label: "Genre",
                            value: genre,
                            options: genreControlOptions(all.map(movie => movie.data.genre)),
                        },
                    ]}
                    resetTo="/movies"
                />
                <SectionHeader>Movies</SectionHeader>
                {movies.length === 0 ? (
                    <EmptyState className="py-12">
                        <EmptyStateIcon>
                            <Icon name="search" size={48} />
                        </EmptyStateIcon>
                        <EmptyStateHeading>No movies match</EmptyStateHeading>
                        <EmptyStateDescription>
                            Try a different genre, or reset the filters.
                        </EmptyStateDescription>
                    </EmptyState>
                ) : (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                        {movies.map(movie => (
                            <MovieCell key={movie.data.title} movie={movie} />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
