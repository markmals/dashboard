import { json, useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { VideoCell } from "~/components/CollectionCells"
import {
    combineComparators,
    withContent,
    titleSortComparator,
    yearSortComparator,
    idSortComparator,
} from "~/lib/sort-comparators"
import { getCollection } from "~/lib/content.server"
import { SectionHeader } from "~/components/SectionHeader"

export const meta = mergeMeta(({ parentTitle }) => [
    { title: `Developer Education • ${parentTitle}` },
])

const comparators = combineComparators(
    withContent(yearSortComparator),
    withContent(titleSortComparator),
)

function getNestedCollection<T extends { id: string }>(collection: T[], key: string): T[] {
    return [...collection].filter(entry => entry.id.startsWith(key))
}

export async function loader() {
    const wwdc = await getCollection("wwdc")
    const pointFree = await getCollection("pointFree")

    return json({
        wwdc: {
            essentials: getNestedCollection(wwdc, "essentials").toSorted(comparators),
            advanced: getNestedCollection(wwdc, "advanced").toSorted(comparators),
            new: getNestedCollection(wwdc, "whats-new").toSorted(comparators),
        },
        pointFree: {
            observation: getNestedCollection(pointFree, "observation").toSorted(idSortComparator),
            combine: getNestedCollection(pointFree, "combine").toSorted(idSortComparator),
            concurrency: getNestedCollection(pointFree, "concurrency").toSorted(idSortComparator),
        },
    })
}

export default function Component() {
    const { wwdc, pointFree } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col gap-10">
            <div>
                <SectionHeader> WWDC Essentials</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {wwdc.essentials.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
            <div>
                <SectionHeader>Point-Free: Observation</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {pointFree.observation.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
            <div>
                <SectionHeader>Point-Free: Concurrency</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {pointFree.concurrency.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
            <div>
                <SectionHeader>Point-Free: Combine</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {pointFree.combine.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
            <div>
                <SectionHeader> WWDC What's New</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {wwdc.new.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
            <div>
                <SectionHeader> WWDC Deep Dive</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                    {wwdc.advanced.map(video => (
                        <VideoCell video={video} key={video.data.link} />
                    ))}
                </ul>
            </div>
        </div>
    )
}
