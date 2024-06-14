import tvMovies from "../data/movies-and-tv.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { SectionHeader } from "~/components/SectionHeader"
import { titleSortComparator } from "~/lib/sort-comparators"
import { MovieCell, TVShowCell } from "~/components/CollectionCells"

export const meta = mergeMeta(({ parentTitle }) => [
    { title: `TV Shows & Movies • ${parentTitle}` },
])

export function loader() {
    return tvMovies
}

export default function Component() {
    const { tvShows, movies } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col gap-10">
            <SectionHeader>TV Shows</SectionHeader>
            <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 pb-12 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
            >
                {tvShows.toSorted(titleSortComparator).map(show => (
                    <TVShowCell show={show} key={show.title} />
                ))}
            </ul>

            <SectionHeader>Movies</SectionHeader>
            <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
            >
                {movies.toSorted(titleSortComparator).map(movie => (
                    <MovieCell movie={movie} key={movie.title} />
                ))}
            </ul>
        </div>
    )
}
