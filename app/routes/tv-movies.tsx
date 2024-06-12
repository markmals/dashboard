import tvMovies from "../data/movies-and-tv.json"
import { useLoaderData } from "@remix-run/react"
import { Button } from "@tailwindcss/catalyst"
import { PlayCircleIcon } from "@heroicons/react/24/outline"
import { mergeMeta } from "~/lib/merge-meta"
import { SectionHeader } from "~/components/SectionHeader"

type TVShow = (typeof tvMovies.tvShows)[number]
type Movie = (typeof tvMovies.movies)[number]

export const meta = mergeMeta(({ parentTitle }) => [
    { title: `TV Shows & Movies • ${parentTitle}` },
])

export function loader() {
    return tvMovies
}

function TVShowCell({ show: { title, link, description, trailer, poster } }: { show: TVShow }) {
    return (
        <li className="flex w-full flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    href={link}
                    className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100"
                >
                    <img src={poster} className="object-cover" />
                </a>
                <div>
                    <a
                        href={link}
                        className="mt-2 truncate text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                    >
                        {title}
                    </a>
                    {/* <p className="text-sm font-medium text-black/70 dark:text-white/70">
                        {description}
                    </p> */}
                </div>
            </div>
            <div>
                <Button plain className="font-normal text-blue-500" href={trailer}>
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500" />
                </Button>
            </div>
        </li>
    )
}

function MovieCell({
    movie: { title, link, year, genre, runningTime, trailer, poster },
}: {
    movie: Movie
}) {
    return (
        <li className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    href={link}
                    className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100"
                >
                    <img src={poster} className="object-cover" />
                </a>
                <div className="flex flex-col">
                    <a
                        href={link}
                        className="mt-2 truncate text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                    >
                        {title}
                    </a>
                    <p className="text-sm font-medium text-black/70 dark:text-white/70">
                        {year} • {genre} • {runningTime}
                    </p>
                </div>
            </div>
            <div>
                <Button plain className="font-normal text-blue-500" href={trailer}>
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500" />
                </Button>
            </div>
        </li>
    )
}

const sortComparator = (lhs: { title: string }, rhs: { title: string }) => {
    const articles = ["a", "an", "the"].join("|")
    const regex = new RegExp("^(?:(" + articles + ") )(.*)$")
    const replacer = (_: string, $1: string, $2: string) => {
        console.log($1, $2)
        return $2
    }

    return lhs.title
        .replace(regex, replacer)
        .localeCompare(rhs.title.replace(regex, replacer), undefined, {
            ignorePunctuation: true,
            numeric: true,
            sensitivity: "base",
        })
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
                {tvShows.toSorted(sortComparator).map(show => (
                    <TVShowCell show={show} key={show.title} />
                ))}
            </ul>

            <SectionHeader>Movies</SectionHeader>
            <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
            >
                {movies.toSorted(sortComparator).map(movie => (
                    <MovieCell movie={movie} key={movie.title} />
                ))}
            </ul>
        </div>
    )
}
