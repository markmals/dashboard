import { EventCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

import type { Route } from "./+types/activities";

export async function loader() {
    const events = await getCollection("events");
    return events.toSorted(withContent(titleSortComparator));
}

export default function Component({ loaderData: events }: Route.ComponentProps) {
    return (
        <>
            <title>Events • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Activities</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                    {events.map(event => (
                        <EventCell event={event} key={event.data.thumbnail} />
                    ))}
                </ul>
            </div>
        </>
    );
}
