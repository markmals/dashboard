import { getCollection } from "sprinkles:content";

import { EventCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

export async function ServerComponent() {
    let events = (await getCollection("events")).toSorted(withContent(titleSortComparator));
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
