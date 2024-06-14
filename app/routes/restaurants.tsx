import restaurants from "../data/restaurants.json"
import { useLoaderData } from "@remix-run/react"
import { type Restaurant, RestaurantCell } from "~/components/CollectionCells"
import { mergeMeta } from "~/lib/merge-meta"
import { nameSortComparator } from "~/lib/sort-comparators"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `WWDC • ${parentTitle}` }])

export function loader() {
    return restaurants as { restaurants: Restaurant[] }
}

export default function Component() {
    const { restaurants } = useLoaderData<typeof loader>()

    return (
        <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
            {restaurants.toSorted(nameSortComparator).map(restaurant => (
                <RestaurantCell restaurant={restaurant} key={restaurant.thumbnail} />
            ))}
        </ul>
    )
}
