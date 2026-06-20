import {
    EmptyState,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { getCollection, render } from "sprinkles:content";

import { RecipeCell } from "~/components/CollectionCells.tsx";
import { Icon } from "~/components/Icon.tsx";
import { SectionHeader } from "~/components/SectionHeader.tsx";
import { titleSortComparator, withContent } from "~/lib/sort-comparators.ts";

export async function ServerComponent() {
    let recipes = (await getCollection("recipes")).toSorted(withContent(titleSortComparator));
    let rendered = await Promise.all(
        recipes.map(async recipe => ({
            recipe,
            Content: (await render(recipe)).Content,
        })),
    );

    return (
        <>
            <title>Recipes • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Recipes</SectionHeader>
                {rendered.length === 0 ? (
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
                        {rendered.map(({ recipe, Content }) => (
                            <RecipeCell
                                Content={Content}
                                key={recipe.data.source}
                                recipe={recipe}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
