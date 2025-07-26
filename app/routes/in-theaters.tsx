import { SectionHeader } from "~/components/SectionHeader";
import { titleSortComparator, withContent } from "~/lib/sort-comparators";
import { MovieCell } from "~/components/CollectionCells";
import type { Route } from "./+types/in-theaters";
import { getCollection } from "~/lib/content.server";

export async function loader() {
    const movies = await getCollection("theaters");
    return movies.toSorted(withContent(titleSortComparator));
}

export default function Component(
    { loaderData: movies }: Route.ComponentProps,
) {
    return (
        <>
            <title>In Theaters • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader>In Theaters (July 25 - August 3)</SectionHeader>
                <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                >
                    {movies.map((movie) => (
                        <MovieCell movie={movie} key={movie.id} />
                    ))}
                </ul>
            </div>
        </>
    );
}
