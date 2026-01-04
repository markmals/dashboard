import { RestaurantCell } from "~/components/CollectionCells.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { nameSortComparator, withContent } from "~/lib/sort-comparators.ts";
import type { Route } from "./+types/restaurants";

export async function loader() {
    const restaurants = await getCollection("restaurants");
    return restaurants.toSorted(withContent(nameSortComparator));
}

export default function Component({ loaderData: restaurants }: Route.ComponentProps) {
    return (
        <>
            <title>Restaurants • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Restaurants</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                    {restaurants.map(restaurant => (
                        <RestaurantCell key={restaurant.data.thumbnail} restaurant={restaurant} />
                    ))}
                </ul>
            </div>
        </>
    );
}
