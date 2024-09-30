import { Badge, Button } from "@tailwindcss/ui"
import { PlayCircleIcon, BookOpenIcon } from "@heroicons/react/24/outline"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid"
import { CollectionEntry } from "~/lib/content.server"

export function TVShowCell({
    tvShow: {
        data: { title, link, trailer, poster },
    },
}: {
    tvShow: CollectionEntry<"television">
}) {
    return (
        <li className="flex w-full flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    href={link}
                    className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100"
                    target="_blank"
                >
                    <img src={poster} className="object-cover" />
                </a>
                <a
                    href={link}
                    className="text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                    target="_blank"
                >
                    {title}
                </a>
            </div>
            <div>
                <Button
                    plain
                    className="font-normal text-blue-500 dark:text-blue-400"
                    href={trailer}
                    target="_blank"
                >
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                </Button>
            </div>
        </li>
    )
}

export function MovieCell({
    movie: {
        data: { title, link, year, genre, runningTime, trailer, poster },
    },
}: {
    movie: CollectionEntry<"movies">
}) {
    return (
        <li className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    href={link}
                    className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100"
                    target="_blank"
                >
                    <img src={poster} className="object-cover" />
                </a>
                <div className="flex flex-col">
                    <a
                        href={link}
                        className="mt-2 truncate text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                        target="_blank"
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
                    target="_blank"
                >
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                </Button>
            </div>
        </li>
    )
}

export function EventCell({
    event: {
        data: { title, link, thumbnail },
    },
}: {
    event: CollectionEntry<"events">
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-black/10 md:w-96 dark:bg-white/10">
                    <img src={thumbnail} className="object-cover" />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                        {title}
                    </h2>
                </div>
                <div>
                    {link !== undefined && (
                        <Button
                            plain
                            className="text-blue-500 dark:text-blue-400"
                            href={link}
                            target="_blank"
                        >
                            Learn More
                            <ArrowTopRightOnSquareIcon className="fill-blue-500 dark:fill-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}

export type Video = {
    id: string
    slug: string
    data: {
        title: string
        link: string
        year?: number
        thumbnail: string
        tags: string[]
    }
    body: string
}

export function VideoCell({
    video: {
        data: { title, link, thumbnail, year, tags },
        body: description,
    },
}: {
    video: Video
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-h-9 aspect-w-16 block w-full overflow-hidden rounded-lg bg-black/10 md:w-72 dark:bg-white/10">
                    <img src={thumbnail} className="object-cover" />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="inline-block text-wrap text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                        {title}{" "}
                        {year && (
                            <Badge color="blue" className="align-text-top">
                                {year}
                            </Badge>
                        )}
                    </h2>
                    <p
                        className="text-sm text-black/70 dark:text-white/70"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
                <div>
                    <Button
                        plain
                        className="text-blue-500 dark:text-blue-400"
                        href={link}
                        target="_blank"
                    >
                        Watch
                        <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                    </Button>
                </div>
            </div>
        </li>
    )
}

export function RestaurantCell({
    restaurant: {
        data: { name, thumbnail, menu, address, cuisine },
        body: description,
    },
}: {
    restaurant: CollectionEntry<"restaurants">
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-h-2 aspect-w-3 block w-full overflow-hidden rounded-lg bg-black/10 md:aspect-h-1 md:aspect-w-1 md:w-52 dark:bg-white/10">
                    <img src={thumbnail} className="object-cover" />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                            {name}
                        </h2>
                        <div className="text-sm text-black/70 dark:text-white/70">
                            <span className="inline-block text-wrap">
                                {cuisine} •{" "}
                                <a
                                    href={`http://maps.apple.com/?address=${address.split(" ").join("+")}`}
                                    className="underline hover:text-blue-500 hover:dark:text-blue-400"
                                    target="_blank"
                                >
                                    {address}
                                </a>
                            </span>
                        </div>
                    </div>
                    <p
                        className="text-sm text-black/70 dark:text-white/70"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
                <div>
                    {menu !== undefined && (
                        <Button
                            plain
                            className="text-blue-500 dark:text-blue-400"
                            href={menu}
                            target="_blank"
                        >
                            Menu
                            <BookOpenIcon className="stroke-blue-500 dark:stroke-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}

export function RecipeCell({
    recipe: {
        data: { title, source, thumbnail },
        body: description,
    },
}: {
    recipe: CollectionEntry<"recipes">
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-h-2 aspect-w-3 block w-full overflow-hidden rounded-lg bg-black/10 md:w-72 dark:bg-white/10">
                    <img src={thumbnail} className="object-cover" />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <a href={source} target="_blank">
                            <h2 className="text-xl font-medium text-black/95 hover:text-blue-500 md:truncate dark:text-white/95 hover:dark:text-blue-400">
                                {title}
                            </h2>
                        </a>
                    </div>
                    <p
                        className="text-sm text-black/70 dark:text-white/70"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
            </div>
        </li>
    )
}
