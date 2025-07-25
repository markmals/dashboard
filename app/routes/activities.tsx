import { useLoaderData } from "react-router";
import { EventCell } from "~/components/CollectionCells";
import { SectionHeader } from "~/components/SectionHeader";
import { getCollection } from "~/lib/content.server";
import { mergeMeta } from "~/lib/merge-meta";
import { titleSortComparator, withContent } from "~/lib/sort-comparators";

export const meta = mergeMeta((
    { parentTitle },
) => [{ title: `Events • ${parentTitle}` }]);

export async function loader() {
    const events = await getCollection("events");
    return events.toSorted(withContent(titleSortComparator));
}

export default function Component() {
    const events = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col">
            <SectionHeader>Activities</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                {events.map((event) => (
                    <EventCell event={event} key={event.data.thumbnail} />
                ))}
            </ul>
        </div>
    );
}
