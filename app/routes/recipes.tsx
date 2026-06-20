import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";

import { RecipeCell } from "~/components/CollectionCells.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { getCollection } from "~/lib/content.server.ts";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

import type { Route } from "./+types/recipes";

export async function loader() {
    let recipes = await getCollection("recipes");
    return recipes.toSorted(withContent(titleSortComparator));
}

export default function Component({ loaderData: recipes }: Route.ComponentProps) {
    return (
        <>
            <title>Recipes • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Recipes</SectionHeader>
                {recipes.length === 0 ? (
                    <EmptyState className="py-12">
                        <EmptyStateIcon>
                            <Icon name="book" size={48} />
                        </EmptyStateIcon>
                        <EmptyStateHeading>No recipes yet</EmptyStateHeading>
                        <EmptyStateDescription>
                            Recipes will appear here once added.
                        </EmptyStateDescription>
                    </EmptyState>
                ) : (
                    <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                        {recipes.map(recipe => (
                            <RecipeCell key={recipe.data.source} recipe={recipe} />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
