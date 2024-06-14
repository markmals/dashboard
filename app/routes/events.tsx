import events from "../data/events.json"
import { useLoaderData } from "@remix-run/react"
import { EventCell, type Event } from "~/components/CollectionCells"
import { mergeMeta } from "~/lib/merge-meta"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `WWDC • ${parentTitle}` }])

export function loader() {
    return events as { events: Event[] }
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
