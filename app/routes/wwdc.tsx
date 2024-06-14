import wwdc from "../data/wwdc.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { SectionHeader } from "~/components/SectionHeader"
import { Fragment } from "react"
import { WWDCVideo, VideoCell } from "~/components/CollectionCells"
import { titleSortComparator } from "~/lib/sort-comparators"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `WWDC • ${parentTitle}` }])

export function loader() {
    return wwdc as { videos: WWDCVideo[] }
}

export default function Component() {
    const { videos } = useLoaderData<typeof loader>()
    const sections = Object.entries(Object.groupBy(videos, ({ availableOn }) => availableOn))

    return sections.map(([sectionTitle, videos], idx) => (
        <Fragment key={sectionTitle}>
            <SectionHeader className={idx === 0 ? "" : "mt-10"}>{sectionTitle}</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {videos!.toSorted(titleSortComparator).map(video => (
                    <VideoCell video={video} key={video.thumbnail} />
                ))}
            </ul>
        </Fragment>
    ))
}
