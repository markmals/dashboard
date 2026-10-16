import {
    Badge,
    Button,
    DescriptionDetails,
    DescriptionList,
    DescriptionTerm,
    Heading,
    Text,
} from "@tailwindcss/ui";
import { Fragment } from "react";

import type { CollectionEntry } from "~/lib/content-types.ts";

import { Icon } from "~/components/Icon.tsx";
import { InlineMarkdown } from "~/components/InlineMarkdown.tsx";
import { MainIngredients } from "~/components/recipe/MainIngredients.tsx";

type Recipe = CollectionEntry<"recipes">["data"];

const FACTS = [
    { label: "Yield", key: "yield" },
    { label: "Prep", key: "prepTime" },
    { label: "Cook", key: "cookTime" },
    { label: "Total", key: "totalTime" },
] as const;

export function RecipeHeader({ recipe }: { recipe: Recipe }) {
    let facts = FACTS.flatMap(({ label, key }) => {
        let value = recipe[key];
        return value ? [{ label, value: key === "yield" ? value : formatDuration(value) }] : [];
    });

    // Phones read straight down: photo, title, main ingredients, then the description. Wide screens
    // put the photo beside the title and description, with main ingredients spanning the width below.
    return (
        <header className="grid gap-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr_auto] lg:gap-x-12">
            {recipe.image && (
                <img
                    alt=""
                    className="aspect-4/3 w-full rounded-xl bg-zinc-950/5 object-cover lg:col-start-2 lg:row-span-2 lg:row-start-1 dark:bg-white/5"
                    fetchPriority="high"
                    src={recipe.image}
                />
            )}
            <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1">
                <Heading className="text-balance sm:text-4xl/11">{recipe.title}</Heading>
                {recipe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {recipe.categories.map(category => (
                            <Badge key={category}>{category}</Badge>
                        ))}
                    </div>
                )}
            </div>
            <MainIngredients
                className="lg:col-span-2 lg:row-start-3 lg:mt-6"
                ingredients={recipe.mainIngredients}
            />
            <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
                {recipe.description?.split("\n").map(paragraph => (
                    <Text className="text-pretty" key={paragraph}>
                        <InlineMarkdown text={paragraph} />
                    </Text>
                ))}
                {facts.length > 0 && (
                    <DescriptionList>
                        {facts.map(({ label, value }) => (
                            <Fragment key={label}>
                                <DescriptionTerm>{label}</DescriptionTerm>
                                <DescriptionDetails>{value}</DescriptionDetails>
                            </Fragment>
                        ))}
                    </DescriptionList>
                )}
                {recipe.source && <RecipeSource source={recipe.source} />}
            </div>
        </header>
    );
}

// Mela writes times tersely ("1h 30min"); spell the units out for reading ("1 hr 30 min").
function formatDuration(duration: string): string {
    return duration.replace(/(\d)\s*h\b/g, "$1 hr").replace(/(\d)\s*min\b/g, "$1 min");
}

// Mela's source is usually the recipe's URL, but can be any text ("Grandma's card box").
function RecipeSource({ source }: { source: string }) {
    if (!URL.canParse(source) || !/^https?:/.test(source)) {
        return <Text>From {source}</Text>;
    }
    return (
        <div>
            <Button href={source} rel="noopener" soft target="_blank">
                View on {new URL(source).hostname.replace(/^www\./, "")}
                <Icon name="pop-out" />
            </Button>
        </div>
    );
}
