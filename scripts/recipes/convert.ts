import type { MainIngredients } from "./main-ingredients.ts";
import type { MelaRecipe } from "./mela.ts";

// The shape of a file in app/content/recipes. The site build validates every file against the
// `recipes` collection schema in app/content.config.ts, which this mirrors; it's restated here
// because scripts and app code are separate TypeScript projects.
export interface RecipeGroup {
    title?: string;
    items: string[];
}

export interface RecipeFile {
    title: string;
    description?: string;
    source?: string;
    image?: string;
    yield?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    categories?: string[];
    mainIngredients?: MainIngredients;
    ingredients?: RecipeGroup[];
    instructions?: RecipeGroup[];
    notes?: RecipeGroup[];
    nutrition?: RecipeGroup[];
}

// The recipe's permalink segment and file name: "Musakhan (Palestinian Chicken)" becomes
// "musakhan-palestinian-chicken". Accents are folded; other scripts' letters are kept.
export function slugify(title: string): string {
    return title
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
}

export function toRecipeFile(
    mela: MelaRecipe & { title: string },
    extras: { image?: string; mainIngredients?: MainIngredients },
): RecipeFile {
    let recipe: RecipeFile = {
        title: mela.title,
        description: lines(mela.text).join("\n") || undefined,
        source: mela.link?.trim() || undefined,
        image: extras.image,
        yield: mela.yield?.trim() || undefined,
        prepTime: mela.prepTime?.trim() || undefined,
        cookTime: mela.cookTime?.trim() || undefined,
        totalTime: mela.totalTime?.trim() || undefined,
        categories: (mela.categories ?? []).map(category => category.trim()).filter(Boolean),
        mainIngredients: extras.mainIngredients,
        ingredients: parseGroups(mela.ingredients),
        instructions: parseGroups(mela.instructions),
        notes: parseGroups(mela.notes),
        nutrition: parseGroups(mela.nutrition),
    };
    // Empty lists are omitted like missing strings; the collection schema defaults them to [].
    for (let key of Object.keys(recipe) as (keyof RecipeFile)[]) {
        let value = recipe[key];
        if (Array.isArray(value) && value.length === 0) delete recipe[key];
    }
    return recipe;
}

const HEADING_RE = /^#+\s*(.*?)\s*:?$/;

// Mela separates items with newlines and starts a titled group at each `#` line ("# For the
// sauce:"). Lines before the first heading form an untitled group; empty groups are dropped.
export function parseGroups(text: string | null | undefined): RecipeGroup[] {
    let groups: RecipeGroup[] = [];
    let current: RecipeGroup | undefined;
    for (let line of lines(text)) {
        let heading = HEADING_RE.exec(line);
        if (heading) {
            current = heading[1] ? { title: heading[1], items: [] } : { items: [] };
            groups.push(current);
            continue;
        }
        if (!current) {
            current = { items: [] };
            groups.push(current);
        }
        current.items.push(line);
    }
    return groups.filter(group => group.items.length > 0);
}

function lines(text: string | null | undefined): string[] {
    return (text ?? "")
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
}
