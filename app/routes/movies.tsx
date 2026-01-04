import { MovieCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";
import type { Route } from "./+types/movies";

export async function loader() {
    const movies = await getCollection("movies");
    return movies.toSorted(withContent(titleSortComparator));
}

export default function Component({ loaderData: movies }: Route.ComponentProps) {
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
