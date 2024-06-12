import wwdc from "../data/wwdc.json"
import { useLoaderData } from "@remix-run/react"
import { mergeMeta } from "~/lib/merge-meta"
import { Button } from "@tailwindcss/catalyst"
import { PlayCircleIcon } from "@heroicons/react/24/outline"
import { SectionHeader } from "~/components/SectionHeader"

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
        <li className="flex flex-col items-start gap-6 border-black/15 py-10 md:flex-row dark:border-white/15">
            <img src={thumbnail} className="w-40 object-scale-down md:w-52" />
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <h2 className="truncate text-xl font-medium text-black/95 dark:text-white/95">
                        {title}
                    </h2>
                    <p className="text-sm text-black/70 dark:text-white/70">{description}</p>
                </div>
                <div>
                    {link !== undefined ? (
                        <Button plain className="font-normal text-blue-500" href={link}>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500" />
                        </Button>
                    ) : (
                        <Button plain className="group font-normal text-blue-500" disabled>
                            Watch
                            <PlayCircleIcon className="stroke-blue-500 group-data-[disabled]:stroke-black/35" />
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
        <>
            <SectionHeader className={idx === 0 ? "" : "mt-10"} key={sectionTitle}>
                {sectionTitle}
            </SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {videos!.map(video => (
                    <VideoCell video={video} key={video.link} />
                ))}
            </ul>
        </>
    ))
}
