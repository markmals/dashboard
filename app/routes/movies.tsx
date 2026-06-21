import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection } from "sprinkles:content";

import type { SortOption } from "~/lib/collections.ts";
import type { CollectionEntry } from "~/lib/content-types.ts";

import { MovieCell } from "~/components/CollectionCells.tsx";
import { CollectionControls } from "~/components/CollectionControls.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import {
    genreControlOptions,
    matchesGenre,
    pickSort,
    resolvePageParams,
    runtimeMinutes,
    sortControlOptions,
    sortEntries,
    titleKey,
} from "~/lib/collections.ts";

type MovieData = CollectionEntry<"movies">["data"];

const MOVIE_SORTS = {
    title: { label: "Title (A–Z)", criteria: [d => titleKey(d.title)] },
    "year-desc": { label: "Year (newest)", criteria: [d => -Number(d.year)] },
    "year-asc": { label: "Year (oldest)", criteria: [d => Number(d.year)] },
    "runtime-desc": { label: "Runtime (longest)", criteria: [d => -runtimeMinutes(d.runningTime)] },
    "runtime-asc": { label: "Runtime (shortest)", criteria: [d => runtimeMinutes(d.runningTime)] },
} satisfies Record<string, SortOption<MovieData>>;

export async function ServerComponent() {
    let params = resolvePageParams();
    let sort = pickSort(MOVIE_SORTS, params.get("sort"), "title");
    let genre = params.get("genre") ?? "";

    let all = await getCollection("movies");
    let movies = sortEntries(
        all.filter(movie => matchesGenre(movie.data.genre, genre)),
        MOVIE_SORTS[sort],
    );

    let canReset = sort !== "title" || genre !== "";

    return (
        <>
            <title>Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader
                    actions={
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
                                    options: genreControlOptions(
                                        all.map(movie => movie.data.genre),
                                    ),
                                },
                            ]}
                        />
                    }
                >
                    Movies
                </SectionHeader>
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
