import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";

import { RestaurantCell } from "~/components/CollectionCells.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { nameSortComparator, withContent } from "~/lib/sort-comparators.ts";

import type { Route } from "./+types/restaurants";

export async function loader() {
    let restaurants = await getCollection("restaurants");
    return restaurants.toSorted(withContent(nameSortComparator));
}

export default function Component({ loaderData: restaurants }: Route.ComponentProps) {
    return (
        <>
            <title>Restaurants • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Restaurants</SectionHeader>
                {restaurants.length === 0 ? (
                    <EmptyState className="py-12">
                        <EmptyStateIcon>
                            <Icon name="dining" size={48} />
                        </EmptyStateIcon>
                        <EmptyStateHeading>No restaurants yet</EmptyStateHeading>
                        <EmptyStateDescription>
                            Restaurants will appear here once added.
                        </EmptyStateDescription>
                    </EmptyState>
                ) : (
                    <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                        {restaurants.map(restaurant => (
                            <RestaurantCell
                                key={restaurant.data.thumbnail}
                                restaurant={restaurant}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
