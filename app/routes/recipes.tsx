import recipes from "../data/recipes.json"
import { useLoaderData } from "@remix-run/react"
import { RecipeCell } from "~/components/CollectionCells"
import { SectionHeader } from "~/components/SectionHeader"
import { mergeMeta } from "~/lib/merge-meta"

export const meta = mergeMeta(({ parentTitle }) => [{ title: `Recipes • ${parentTitle}` }])

export function loader() {
    return recipes
}

export default function Component() {
    const { recipes } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col gap-10">
            <SectionHeader>Recipes</SectionHeader>
            <ul className="flex flex-col border-black/15 *:border-b last:*:border-none dark:border-white/15">
                {recipes.map(recipe => (
                    <RecipeCell recipe={recipe} key={recipe.source} />
                ))}
            </ul>
        </div>
    )
}
