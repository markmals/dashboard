import { RecipeCell } from "~/components/CollectionCells";
import { SectionHeader } from "~/components/SectionHeader";
import { getCollection } from "~/lib/content.server";
import { titleSortComparator, withContent } from "~/lib/sort-comparators";
import type { Route } from "./+types/recipes";

export async function loader() {
    const recipes = await getCollection("recipes");
    return recipes.toSorted(withContent(titleSortComparator));
}

export default function Component({ loaderData: recipes }: Route.ComponentProps) {
    return (
        <>
            <title>Recipes • Dashboard</title>
            <div className="flex flex-col">
                <SectionHeader>Recipes</SectionHeader>
                <ul className="flex flex-col border-black/15 *:border-b *:last:border-none dark:border-white/15">
                    {recipes.map(recipe => <RecipeCell recipe={recipe} key={recipe.data.source} />)}
                </ul>
            </div>
        </>
    );
}
