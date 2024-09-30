import { json, useLoaderData } from "@remix-run/react"
import { RestaurantCell } from "~/components/CollectionCells"
import { SectionHeader } from "~/components/SectionHeader"
import { getCollection } from "~/lib/content.server"
import { mergeMeta } from "~/lib/merge-meta"
import { withContent, nameSortComparator } from "~/lib/sort-comparators"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `Restaurants • ${parentTitle}` }])

export async function loader() {
    const restaurants = await getCollection("restaurants")
    return json(restaurants.toSorted(withContent(nameSortComparator)))
}

export default function Component() {
    const restaurants = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col">
            <SectionHeader>Restaurants</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {restaurants.map(restaurant => (
                    <RestaurantCell restaurant={restaurant} key={restaurant.data.thumbnail} />
                ))}
            </ul>
        </div>
    )
}
