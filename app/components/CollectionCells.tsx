/* eslint-disable react-dom/no-dangerously-set-innerhtml */

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { BookOpenIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { Badge, Button } from "@tailwindcss/ui";
import type { CollectionEntry } from "~/lib/content.server.ts";

export function TVShowCell({
    tvShow: {
        data: { title, link, trailer, poster },
    },
}: {
    tvShow: CollectionEntry<"television">;
}) {
    return (
        <li className="flex w-full flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg bg-gray-100"
                    href={link}
                    target="_blank"
                >
                    <img className="object-cover" src={poster} />
                </a>
                <a
                    className="text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                    href={link}
                    target="_blank"
                >
                    {title}
                </a>
            </div>
            {trailer && (
                <div>
                    <Button
                        className="font-normal text-blue-500 dark:text-blue-400"
                        href={trailer}
                        plain
                        target="_blank"
                    >
                        Trailer
                        <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                    </Button>
                </div>
            )}
        </li>
    );
}

export function MovieCell({
    movie: { data: movie },
}: {
    movie:
        | Omit<CollectionEntry<"movies">, "collection">
        | Omit<CollectionEntry<"theaters">, "collection">;
}) {
    return (
        <li className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                <a
                    className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg bg-gray-100"
                    href={movie.link}
                    target="_blank"
                >
                    <img className="object-cover" src={movie.poster} />
                </a>
                <div className="flex flex-col">
                    <a
                        className="mt-2 truncate text-sm font-medium text-black/95 hover:text-blue-600 dark:text-white/95 dark:hover:text-blue-500"
                        href={movie.link}
                        target="_blank"
                    >
                        {movie.title}
                    </a>
                    <p className="text-sm font-medium text-black/70 dark:text-white/70">
                        {"release" in movie && movie.release && `${movie.release} • `}
                        {movie.runningTime && `${movie.runningTime} • `}
                        {movie.genre}
                        {"year" in movie && movie.year && ` • ${movie.year}`}
                    </p>
                </div>
            </div>
            <div>
                <Button
                    className="font-normal text-blue-500 dark:text-blue-400"
                    href={movie.trailer}
                    plain
                    target="_blank"
                >
                    Trailer
                    <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                </Button>
            </div>
        </li>
    );
}

export function EventCell({
    event: {
        data: { title, link, thumbnail },
    },
}: {
    event: CollectionEntry<"events">;
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pt-10 pb-6 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-black/10 md:w-96 dark:bg-white/10">
                    <img className="object-cover" src={thumbnail} />
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
                            className="text-blue-500 dark:text-blue-400"
                            href={link}
                            plain
                            target="_blank"
                        >
                            Learn More
                            <ArrowTopRightOnSquareIcon className="fill-blue-500 dark:fill-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    );
}

export interface Video {
    id: string;
    slug: string;
    data: {
        title: string;
        link: string;
        year?: number;
        thumbnail: string;
        tags: string[];
    };
    body: string;
}

export function VideoCell({
    video: {
        data: { title, link, thumbnail, year, tags: _tags },
        body: description,
    },
}: {
    video: Video;
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pt-10 pb-6 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-w-16 aspect-h-9 block w-full overflow-hidden rounded-lg bg-black/10 md:w-72 dark:bg-white/10">
                    <img className="object-cover" src={thumbnail} />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="inline-block text-xl font-medium text-wrap text-black/95 md:truncate dark:text-white/95">
                        {title}{" "}
                        {Boolean(year) && (
                            <Badge className="align-text-top" color="blue">
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
                        className="text-blue-500 dark:text-blue-400"
                        href={link}
                        plain
                        target="_blank"
                    >
                        Watch
                        <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                    </Button>
                </div>
            </div>
        </li>
    );
}

export function RestaurantCell({
    restaurant: {
        data: { name, thumbnail, menu, address, cuisine },
        body: description,
    },
}: {
    restaurant: CollectionEntry<"restaurants">;
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pt-10 pb-6 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-w-3 aspect-h-2 md:aspect-w-1 md:aspect-h-1 block w-full overflow-hidden rounded-lg bg-black/10 md:w-52 dark:bg-white/10">
                    <img className="object-cover" src={thumbnail} />
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
                                    className="underline hover:text-blue-500 dark:hover:text-blue-400"
                                    href={`http://maps.apple.com/?address=${address
                                        .split(" ")
                                        .join("+")}`}
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
                            className="text-blue-500 dark:text-blue-400"
                            href={menu}
                            plain
                            target="_blank"
                        >
                            Menu
                            <BookOpenIcon className="stroke-blue-500 dark:stroke-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    );
}

export function RecipeCell({
    recipe: {
        data: { title, source, thumbnail },
        body: description,
    },
}: {
    recipe: CollectionEntry<"recipes">;
}) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pt-10 pb-6 md:flex-row dark:border-white/15">
            <div className="relative w-full md:w-auto">
                <div className="aspect-w-3 aspect-h-2 block w-full overflow-hidden rounded-lg bg-black/10 md:w-72 dark:bg-white/10">
                    <img className="object-cover" src={thumbnail} />
                </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <a href={source} target="_blank">
                            <h2 className="text-xl font-medium text-black/95 hover:text-blue-500 md:truncate dark:text-white/95 dark:hover:text-blue-400">
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
    );
}
