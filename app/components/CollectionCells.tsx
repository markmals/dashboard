import tvMovies from "../data/movies-and-tv.json"
import { Button } from "@tailwindcss/ui"
import { PlayCircleIcon } from "@heroicons/react/24/outline"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid"

export type TVShow = (typeof tvMovies.tvShows)[number]
export type Movie = (typeof tvMovies.movies)[number]

export type WWDCVideo = {
    title: string
    description: string
    thumbnail: string
    availableOn: string
    link?: string
}

export type Event = {
    title: string
    thumbnail: string
    link?: string
}

export function TVShowCell({
    show: { title, link, description, trailer, poster },
}: {
    show: TVShow
}) {
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
                <Button
                    plain
                    className="font-normal text-blue-500 dark:text-blue-400"
                    href={trailer}
                >
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                </Button>
            </div>
        </li>
    )
}

export function MovieCell({
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
                <Button
                    plain
                    className="font-normal text-blue-500 dark:text-blue-400"
                    href={trailer}
                >
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                </Button>
            </div>
        </li>
    )
}

export function EventCell({ event: { title, link, thumbnail } }: { event: Event }) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <img src={thumbnail} className="w-full rounded-lg object-scale-down md:w-52" />
            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                        {title}
                    </h2>
                </div>
                <div>
                    {link !== undefined && (
                        <Button plain className="text-blue-500 dark:text-blue-400" href={link}>
                            Learn More
                            <ArrowTopRightOnSquareIcon className="fill-blue-500 dark:fill-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}

export function VideoCell({
    video: { title, description, link, thumbnail },
}: {
    video: WWDCVideo
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <img src={thumbnail} className="w-full rounded-lg object-scale-down md:w-52" />
            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                        {title}
                    </h2>
                    <p className="text-sm text-black/70 dark:text-white/70">{description}</p>
                </div>
                <div>
                    {link !== undefined ? (
                        <Button plain className="text-blue-500 dark:text-blue-400" href={link}>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                        </Button>
                    ) : (
                        <Button plain className="group text-blue-500 dark:text-blue-400" disabled>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500 group-data-[disabled]:stroke-black/35 dark:stroke-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}
