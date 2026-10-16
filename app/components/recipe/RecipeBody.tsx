import type { ReactNode } from "react";

import { Heading, Subheading, Text } from "@tailwindcss/ui";

import type { CollectionEntry } from "~/lib/content-types.ts";

import { InlineMarkdown } from "~/components/InlineMarkdown.tsx";

type Recipe = CollectionEntry<"recipes">["data"];
type RecipeGroup = Recipe["ingredients"][number];

export function RecipeBody({ recipe }: { recipe: Recipe }) {
    return (
        <>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
                {recipe.ingredients.length > 0 && (
                    <RecipeSection title="Ingredients">
                        <IngredientList groups={recipe.ingredients} />
                    </RecipeSection>
                )}
                {recipe.instructions.length > 0 && (
                    <RecipeSection title="Instructions">
                        <InstructionList groups={recipe.instructions} />
                    </RecipeSection>
                )}
            </div>
            {recipe.notes.length > 0 && (
                <RecipeSection title="Notes">
                    <Paragraphs groups={recipe.notes} />
                </RecipeSection>
            )}
            {recipe.nutrition.length > 0 && (
                <RecipeSection title="Nutrition">
                    <Paragraphs groups={recipe.nutrition} />
                </RecipeSection>
            )}
        </>
    );
}

function RecipeSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-5">
            <Heading level={2}>{title}</Heading>
            {children}
        </section>
    );
}

function GroupTitle({ children }: { children: ReactNode }) {
    return (
        <Subheading className="mb-2" level={3}>
            {children}
        </Subheading>
    );
}

function IngredientList({ groups }: { groups: RecipeGroup[] }) {
    return groups.map((group, index) => (
        <div key={group.title ?? index}>
            {group.title && <GroupTitle>{group.title}</GroupTitle>}
            <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                {group.items.map(item => (
                    <li
                        className="py-2.5 text-base/6 text-zinc-800 first:pt-0 sm:text-sm/6 dark:text-zinc-200"
                        key={item}
                    >
                        <InlineMarkdown text={item} />
                    </li>
                ))}
            </ul>
        </div>
    ));
}

// Steps are numbered straight through the groups so "step 5" means one thing on the page.
function InstructionList({ groups }: { groups: RecipeGroup[] }) {
    let firstStepOfGroup = groups.map((_, index) =>
        groups.slice(0, index).reduce((count, group) => count + group.items.length, 1),
    );

    return groups.map((group, groupIndex) => (
        <div key={group.title ?? groupIndex}>
            {group.title && <GroupTitle>{group.title}</GroupTitle>}
            <ol className="flex flex-col gap-6" start={firstStepOfGroup[groupIndex]}>
                {group.items.map((step, stepIndex) => (
                    <li className="flex gap-4" key={step}>
                        <span
                            aria-hidden="true"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-950/5 text-sm/6 font-semibold text-zinc-950 tabular-nums dark:bg-white/10 dark:text-white"
                        >
                            {firstStepOfGroup[groupIndex] + stepIndex}
                        </span>
                        {/* Larger than the kit's `Text` (which can't be resized) to stay readable from the stove. */}
                        <p className="max-w-prose pt-0.5 text-base/7 text-pretty text-zinc-800 dark:text-zinc-200">
                            <InlineMarkdown text={step} />
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    ));
}

function Paragraphs({ groups }: { groups: RecipeGroup[] }) {
    return groups.map((group, index) => (
        <div className="flex max-w-prose flex-col gap-3" key={group.title ?? index}>
            {group.title && <GroupTitle>{group.title}</GroupTitle>}
            {group.items.map(item => (
                <Text key={item}>
                    <InlineMarkdown text={item} />
                </Text>
            ))}
        </div>
    ));
}
