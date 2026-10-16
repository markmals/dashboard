import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { sortBy } from "es-toolkit/array";
import { getCollection } from "sprinkles:content";

import { RecipeCell } from "~/components/CollectionCells.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { titleKey } from "~/lib/collections.ts";

export async function ServerComponent() {
    let recipes = sortBy(await getCollection("recipes"), [recipe => titleKey(recipe.data.title)]);

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
                            <RecipeCell key={recipe.id} recipe={recipe} />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
