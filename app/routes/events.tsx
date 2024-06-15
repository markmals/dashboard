import events from "../data/events.json"
import { useLoaderData } from "@remix-run/react"
import { EventCell, type Event } from "~/components/CollectionCells"
import { SectionHeader } from "~/components/SectionHeader"
import { mergeMeta } from "~/lib/merge-meta"
import { titleSortComparator } from "~/lib/sort-comparators"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `Events • ${parentTitle}` }])

export function loader() {
    return events as { events: Event[] }
}

export default function Component() {
    const { events } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col">
            <SectionHeader>Events</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {events.toSorted(titleSortComparator).map(event => (
                    <EventCell event={event} key={event.thumbnail} />
                ))}
            </ul>
        </div>
    )
}
