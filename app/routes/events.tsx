import events from "../data/events.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { Button } from "@tailwindcss/ui"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `WWDC • ${parentTitle}` }])

type Event = {
    title: string
    thumbnail: string
    link?: string
}

export function loader() {
    return events as { events: Event[] }
}

function EventCell({ event: { title, link, thumbnail } }: { event: Event }) {
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

export default function Component() {
    const { events } = useLoaderData<typeof loader>()

    return (
        <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
            {events.map(event => (
                <EventCell event={event} key={event.thumbnail} />
            ))}
        </ul>
    )
}
