import { getCollection } from "sprinkles:content";

import { MovieCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

export async function ServerComponent() {
    let movies = (await getCollection("movies")).toSorted(withContent(titleSortComparator));
    return (
        <>
            <title>Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader>Movies</SectionHeader>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                    {movies.map(movie => (
                        <MovieCell key={movie.data.title} movie={movie} />
                    ))}
                </ul>
            </div>
        </>
    );
}
