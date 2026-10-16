// Imports Mela exports into the `recipes` content collection. Run via `mise run recipes:import
// <path>...`, where each path is a .melarecipe file, a .melarecipes archive, or a directory of either.
//
// Each recipe becomes app/content/recipes/<slug>.json, served at /recipes/<slug>, with its first
// photo at public/recipes/<slug>.jpg. The slug comes from the title, so re-importing a recipe
// overwrites its files in place. The one exception is `mainIngredients`: a value already in the file
// (generated earlier or edited by hand) is kept. Delete the field to have it regenerated.

import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { z } from "zod";

import { slugify, toRecipeFile } from "./convert.ts";
import {
    createMainIngredientExtractor,
    type MainIngredients,
    MainIngredientsSchema,
    withoutEmptyKinds,
} from "./main-ingredients.ts";
import { type MelaRecipe, readMelaRecipes } from "./mela.ts";

let ExistingRecipeSchema = z.object({ mainIngredients: MainIngredientsSchema.optional() });

const ROOT = join(import.meta.dirname, "..", "..");
const CONTENT_DIR = join(ROOT, "app", "content", "recipes");
const IMAGE_DIR = join(ROOT, "public", "recipes");
const OXFMT = join(ROOT, "node_modules", ".bin", "oxfmt");
// Bounds concurrent model requests; image encoding and file writes ride along with them.
const CONCURRENCY = 4;

let inputs = process.argv.slice(2);
if (inputs.length === 0) {
    console.error("Usage: mise run recipes:import <file.melarecipe | file.melarecipes | dir>...");
    process.exit(1);
}

let extractMainIngredients = await createMainIngredientExtractor();
await mkdir(CONTENT_DIR, { recursive: true });
await mkdir(IMAGE_DIR, { recursive: true });

// Slug -> title for this run, so two recipes that slugify alike fail instead of overwriting.
let claimedSlugs = new Map<string, string>();
let writtenFiles: string[] = [];
let failed = 0;

await forEachConcurrently(readAll(inputs), CONCURRENCY, async mela => {
    try {
        let slug = await importRecipe(mela);
        writtenFiles.push(join(CONTENT_DIR, `${slug}.json`));
        console.log(`✓ /recipes/${slug}`);
    } catch (error) {
        failed++;
        console.error(
            `✗ ${mela.title ?? mela.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
});

// Match the project's formatter so a later `mise run fmt` doesn't rewrite fresh imports.
if (writtenFiles.length > 0) await promisify(execFile)(OXFMT, writtenFiles, { cwd: ROOT });

console.log(`\n${writtenFiles.length} imported, ${failed} failed.`);
if (failed > 0) process.exitCode = 1;

async function importRecipe(mela: MelaRecipe): Promise<string> {
    let title = mela.title?.trim();
    let slug = slugify(title ?? "");
    if (!title || !slug) throw new Error("recipe has no usable title");
    let claimant = claimedSlugs.get(slug);
    if (claimant)
        throw new Error(`/recipes/${slug} is already taken by "${claimant}" in this import`);
    claimedSlugs.set(slug, title);

    let file = join(CONTENT_DIR, `${slug}.json`);
    let photo = mela.images?.[0];
    let [image, mainIngredients] = await Promise.all([
        photo ? writeImage(photo, slug) : undefined,
        readMainIngredients(file).then(existing => existing ?? extractMainIngredients(mela)),
    ]);
    let recipe = toRecipeFile({ ...mela, title }, { image, mainIngredients });
    await writeFile(file, `${JSON.stringify(recipe, null, 4)}\n`);
    return slug;
}

// Mela embeds full-size photos as base64, often several MB each. Re-encode as a JPEG at most 1200px
// wide: the size link previews ask for, enough for the recipe page at 2x, and a format every
// link-preview client (iMessage included) accepts as an og:image.
async function writeImage(base64: string, slug: string): Promise<string> {
    await sharp(Buffer.from(base64, "base64"))
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(join(IMAGE_DIR, `${slug}.jpg`));
    return `/recipes/${slug}.jpg`;
}

async function readMainIngredients(file: string): Promise<MainIngredients | undefined> {
    let json: string;
    try {
        json = await readFile(file, "utf8");
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
        throw error;
    }
    let { mainIngredients } = ExistingRecipeSchema.parse(JSON.parse(json));
    return mainIngredients && withoutEmptyKinds(mainIngredients);
}

async function* readAll(paths: string[]): AsyncGenerator<MelaRecipe> {
    for (let path of paths) yield* readMelaRecipes(path);
}

// Runs `task` over `items` with at most `limit` in flight. Workers share one iterator; async
// generators queue concurrent `next()` calls, so each item goes to exactly one worker.
async function forEachConcurrently<T>(
    items: AsyncIterable<T>,
    limit: number,
    task: (item: T) => Promise<void>,
): Promise<void> {
    let iterator = items[Symbol.asyncIterator]();
    await Promise.all(
        Array.from({ length: limit }, async () => {
            for (let next = await iterator.next(); !next.done; next = await iterator.next()) {
                await task(next.value);
            }
        }),
    );
}
