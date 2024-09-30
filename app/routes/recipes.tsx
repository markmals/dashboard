import { json, useLoaderData } from "@remix-run/react"
import { RecipeCell } from "~/components/CollectionCells"
import { SectionHeader } from "~/components/SectionHeader"
import { getCollection } from "~/lib/content.server"
import { mergeMeta } from "~/lib/merge-meta"
import { withContent, titleSortComparator } from "~/lib/sort-comparators"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `Recipes • ${parentTitle}` }])

export async function loader() {
    const recipes = await getCollection("recipes")
    return json(recipes.toSorted(withContent(titleSortComparator)))
}

export default function Component() {
    const recipes = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col">
            <SectionHeader>Recipes</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {recipes.map(recipe => (
                    <RecipeCell recipe={recipe} key={recipe.data.source} />
                ))}
            </ul>
        </div>
    )
}
