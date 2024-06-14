import inTheaters from "../data/in-theaters.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { SectionHeader } from "~/components/SectionHeader"
import { titleSortComparator } from "~/lib/sort-comparators"
import { MovieCell } from "~/components/CollectionCells"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `In Theaters • ${parentTitle}` }])

export function loader() {
    return inTheaters
}

export default function Component() {
    const { movies } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col gap-10">
            <SectionHeader>In Theaters (June 10-30)</SectionHeader>
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
