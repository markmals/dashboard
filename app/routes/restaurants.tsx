import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection, render } from "sprinkles:content";

import { RestaurantCell } from "~/components/CollectionCells.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { nameSortComparator, withContent } from "~/lib/sort-comparators.ts";

export async function ServerComponent() {
    let restaurants = (await getCollection("restaurants")).toSorted(
        withContent(nameSortComparator),
    );
    let rendered = await Promise.all(
        restaurants.map(async restaurant => ({
            restaurant,
            Content: (await render(restaurant)).Content,
        })),
    );

    return (
        <>
            <title>Restaurants • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Restaurants</SectionHeader>
                {rendered.length === 0 ? (
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
                        {rendered.map(({ restaurant, Content }) => (
                            <RestaurantCell
                                Content={Content}
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
