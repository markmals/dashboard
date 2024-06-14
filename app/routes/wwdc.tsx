import wwdc from "../data/wwdc.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { Button } from "~/tailwind-ui"
import { PlayCircleIcon } from "@heroicons/react/24/outline"
import { SectionHeader } from "~/components/SectionHeader"
import { Fragment } from "react"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `WWDC • ${parentTitle}` }])

type WWDCVideo = {
    title: string
    description: string
    thumbnail: string
    availableOn: string
    link?: string
}

export function loader() {
    return wwdc as { videos: WWDCVideo[] }
}

function VideoCell({ video: { title, description, link, thumbnail } }: { video: WWDCVideo }) {
    return (
        <li className="flex flex-col items-start gap-6 border-black/15 pb-6 pt-10 md:flex-row dark:border-white/15">
            <img src={thumbnail} className="w-full rounded-lg object-scale-down md:w-52" />
            <div className="flex w-full flex-col justify-between gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium text-black/95 md:truncate dark:text-white/95">
                        {title}
                    </h2>
                    <p className="text-sm text-black/70 dark:text-white/70">{description}</p>
                </div>
                <div>
                    {link !== undefined ? (
                        <Button plain className="text-blue-500 dark:text-blue-400" href={link}>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500 dark:stroke-blue-400" />
                        </Button>
                    ) : (
                        <Button plain className="group text-blue-500 dark:text-blue-400" disabled>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500 group-data-[disabled]:stroke-black/35 dark:stroke-blue-400" />
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}

export default function Component() {
    const { videos } = useLoaderData<typeof loader>()
    const sections = Object.entries(Object.groupBy(videos, ({ availableOn }) => availableOn))

    return sections.map(([sectionTitle, videos], idx) => (
        <Fragment key={sectionTitle}>
            <SectionHeader className={idx === 0 ? "" : "mt-10"}>{sectionTitle}</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {videos!.map(video => (
                    <VideoCell video={video} key={video.thumbnail} />
                ))}
            </ul>
        </Fragment>
    ))
}
