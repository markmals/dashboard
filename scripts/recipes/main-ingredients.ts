// Picks a recipe's main ingredients (the protein, main vegetables, main starch, …) with Claude
// Sonnet 5 through the OMP SDK, reusing whatever Anthropic login omp already has. The SDK only runs
// under Bun.

import { completeSimple } from "@oh-my-pi/pi-ai";
import { discoverAuthStorage, ModelRegistry } from "@oh-my-pi/pi-coding-agent";
import { z } from "zod";

import type { MelaRecipe } from "./mela.ts";

const PROVIDER = "anthropic";
const MODEL_ID = "claude-sonnet-5";
const TOOL_NAME = "record_main_ingredients";

const SYSTEM_PROMPT = `You pick out the main ingredients of a recipe: the few ingredients that define the dish, the ones someone would name when saying what's in it.

Give the protein, the main vegetables, and the main starch, plus any dairy or fruit the dish is built around (the goat cheese in a goat cheese pasta, the pineapple in pineapple fried rice). Leave out seasonings and spices, herbs used as seasoning, onion and garlic unless they're the star, cooking fats, stocks and broths, sauces and condiments, thickeners like flour, and garnishes or optional serving suggestions. Most dishes have 2 to 4 main ingredients in total; never give more than 6. Leave a kind empty when the dish has none worth naming.

Name each ingredient briefly and generically in sentence case, the way a menu would: "Chicken thighs", not "¾ lb. skinless, boneless chicken thighs". Beans, lentils, and chickpeas count as protein when they're the dish's protein; so do eggs. Rice, pasta, noodles, potatoes, bread, tortillas, and polenta are starches.`;

let IngredientNames = z.array(z.string().trim().min(1));

// Every kind is required so the model always answers all five (with [] for none). A single
// list-valued property was tried first; Sonnet 5 sometimes nested the payload inside it.
let ToolArgumentsSchema = z.object({
    protein: IngredientNames,
    vegetable: IngredientNames,
    starch: IngredientNames,
    dairy: IngredientNames,
    fruit: IngredientNames,
});

// The shape stored in a recipe file, where kinds with nothing in them are left out.
export let MainIngredientsSchema = ToolArgumentsSchema.partial();

export type MainIngredients = z.infer<typeof MainIngredientsSchema>;

const MAIN_INGREDIENT_KINDS = ToolArgumentsSchema.keyof().options;

let toolParameters = z.toJSONSchema(ToolArgumentsSchema);

export async function createMainIngredientExtractor(): Promise<
    (recipe: MelaRecipe) => Promise<MainIngredients | undefined>
> {
    let registry = new ModelRegistry(await discoverAuthStorage());
    await registry.refresh();
    let model = registry.getAvailable().find(m => m.provider === PROVIDER && m.id === MODEL_ID);
    if (!model) {
        throw new Error(
            `OMP has no usable ${PROVIDER}/${MODEL_ID}. Log in to Anthropic in omp (/login) and retry.`,
        );
    }
    let apiKey = registry.resolver(model.provider);

    return async recipe => {
        let response = await completeSimple(
            model,
            {
                systemPrompt: [SYSTEM_PROMPT],
                messages: [
                    {
                        role: "user",
                        content: [{ type: "text", text: describe(recipe) }],
                        timestamp: Date.now(),
                    },
                ],
                tools: [
                    {
                        name: TOOL_NAME,
                        description: "Record the recipe's main ingredients, grouped by kind.",
                        parameters: toolParameters,
                    },
                ],
            },
            { apiKey, toolChoice: { type: "tool", name: TOOL_NAME } },
        );
        let call = response.content.find(
            block => block.type === "toolCall" && block.name === TOOL_NAME,
        );
        if (call?.type !== "toolCall") {
            throw new Error(
                `${MODEL_ID} returned no main ingredients: ${response.errorMessage ?? response.stopReason}`,
            );
        }
        return withoutEmptyKinds(ToolArgumentsSchema.parse(call.arguments));
    };
}

export function withoutEmptyKinds(ingredients: MainIngredients): MainIngredients | undefined {
    let kept: MainIngredients = {};
    for (let kind of MAIN_INGREDIENT_KINDS) {
        if (ingredients[kind]?.length) kept[kind] = ingredients[kind];
    }
    return Object.keys(kept).length > 0 ? kept : undefined;
}

function describe(recipe: MelaRecipe): string {
    return [
        `# ${recipe.title}`,
        recipe.yield && `Yield: ${recipe.yield}`,
        `## Ingredients\n${recipe.ingredients ?? ""}`,
        `## Instructions\n${recipe.instructions ?? ""}`,
    ]
        .filter(Boolean)
        .join("\n\n");
}
