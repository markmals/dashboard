import { TVShowCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";
import type { Route } from "./+types/tv";

export async function loader() {
    const tvShows = await getCollection("television");
    return tvShows.toSorted(withContent(titleSortComparator));
}

export default function Component({ loaderData: tvShows }: Route.ComponentProps) {
    return (
        <>
            <title>TV Shows • Dashboard</title>
            <div className="flex flex-col gap-10">
                <SectionHeader>TV Shows</SectionHeader>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 pb-12 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                    {tvShows.map(show => (
                        <TVShowCell key={show.data.title} tvShow={show} />
                    ))}
                </ul>
            </div>
        </>
    );
}
