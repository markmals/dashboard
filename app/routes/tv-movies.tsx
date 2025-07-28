import { MovieCell, TVShowCell } from "~/components/CollectionCells";
import { SectionHeader } from "~/components/SectionHeader";
import { getCollection } from "~/lib/content.server";
import { titleSortComparator, withContent } from "~/lib/sort-comparators";
import type { Route } from "./+types/tv-movies";

export async function loader() {
    const tvShows = await getCollection("television");
    const movies = await getCollection("movies");

    return {
        tvShows: tvShows.toSorted(withContent(titleSortComparator)),
        movies: movies.toSorted(withContent(titleSortComparator)),
    };
}

export default function Component({ loaderData }: Route.ComponentProps) {
    const { tvShows, movies } = loaderData;

    return (
        <>
            <title>TV Shows & Movies • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader>TV Shows</SectionHeader>
                <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 pb-12 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                >
                    {tvShows.map(show => <TVShowCell tvShow={show} key={show.data.title} />)}
                </ul>

                <SectionHeader>Movies</SectionHeader>
                <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
                >
                    {movies.map(movie => <MovieCell movie={movie} key={movie.data.title} />)}
                </ul>
            </div>
        </>
    );
}
