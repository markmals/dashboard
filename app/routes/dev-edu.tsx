import { json, useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { VideoCell } from "~/components/CollectionCells"
import {
    combineComparators,
    withContent,
    titleSortComparator,
    yearSortComparator,
} from "~/lib/sort-comparators"
import { getCollection } from "~/lib/content.server"
import { SectionHeader } from "~/components/SectionHeader"

export const meta = mergeMeta(({ parentTitle }) => [
    { title: `Developer Education • ${parentTitle}` },
])

export async function loader() {
    const wwdc = await getCollection("wwdc")
    return json(
        wwdc.toSorted(
            combineComparators(withContent(yearSortComparator), withContent(titleSortComparator)),
        ),
    )
}

export default function Component() {
    const wwdc = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col">
            <SectionHeader> WWDC</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {wwdc.map(video => (
                    <VideoCell video={video} key={video.data.thumbnail} />
                ))}
            </ul>
        </div>
    )
}
