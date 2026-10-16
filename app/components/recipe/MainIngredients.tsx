import { Badge } from "@tailwindcss/ui";

import type { CollectionEntry } from "~/lib/content-types.ts";

type MainIngredientsByKind = CollectionEntry<"recipes">["data"]["mainIngredients"];

const KINDS = [
    { kind: "protein", label: ["Protein", "Proteins"], color: "rose" },
    { kind: "vegetable", label: ["Vegetable", "Vegetables"], color: "green" },
    { kind: "starch", label: ["Starch", "Starches"], color: "amber" },
    { kind: "dairy", label: ["Dairy", "Dairy"], color: "sky" },
    { kind: "fruit", label: ["Fruit", "Fruit"], color: "fuchsia" },
] as const;

// The dish at a glance: what the meat is, the main veg, the starch. Each kind gets a cell with a
// color-coded label so the eye finds "protein" without reading the whole band. Cells grow to fill
// each wrapped row, so an odd count never leaves an empty cell behind.
export function MainIngredients({
    ingredients,
    className,
}: {
    ingredients: MainIngredientsByKind;
    className?: string;
}) {
    let cells = KINDS.filter(({ kind }) => ingredients[kind].length > 0);
    if (cells.length === 0) return null;

    return (
        <section aria-labelledby="main-ingredients-heading" className={className}>
            <h2 className="sr-only" id="main-ingredients-heading">
                Main ingredients
            </h2>
            <dl className="flex flex-wrap gap-px overflow-hidden rounded-xl bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-700 dark:ring-zinc-700">
                {cells.map(({ kind, label, color }) => {
                    let names = ingredients[kind];
                    return (
                        <div
                            className="flex flex-1 basis-36 flex-col gap-2 bg-zinc-50 px-5 py-4 dark:bg-zinc-800"
                            key={kind}
                        >
                            <dt className="mb-1">
                                <Badge color={color}>{label[names.length > 1 ? 1 : 0]}</Badge>
                            </dt>
                            {names.map(name => (
                                <dd
                                    className="text-base/6 font-semibold text-zinc-950 sm:text-lg/6 dark:text-white"
                                    key={name}
                                >
                                    {name}
                                </dd>
                            ))}
                        </div>
                    );
                })}
            </dl>
        </section>
    );
}
