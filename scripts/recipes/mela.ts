// Reads recipes exported from Mela (https://mela.recipes/fileformat/). A `.melarecipe` file is one
// recipe as JSON; a `.melarecipes` file is a ZIP archive of them. Ported from
// github.com/markmals-archive/mela-decoder-js, but archives are read entry by entry: full-library
// exports run to gigabytes of base64 photos, past what fits in memory (or Node's 2 GiB readFile cap).

import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { buffer } from "node:stream/consumers";
import yauzl from "yauzl";
import { z } from "zod";

let MelaText = z.string().nullish();

let MelaRecipeSchema = z.object({
    id: z.string(),
    title: MelaText,
    text: MelaText,
    images: z.array(z.string()).nullish(),
    categories: z.array(z.string()).nullish(),
    yield: MelaText,
    prepTime: MelaText,
    cookTime: MelaText,
    totalTime: MelaText,
    ingredients: MelaText,
    instructions: MelaText,
    notes: MelaText,
    nutrition: MelaText,
    link: MelaText,
});

export type MelaRecipe = z.infer<typeof MelaRecipeSchema>;

const RECIPE_EXTENSION = ".melarecipe";
const ARCHIVE_EXTENSION = ".melarecipes";

// Yields every recipe in a `.melarecipe` file, a `.melarecipes` archive, or a directory of either.
export async function* readMelaRecipes(path: string): AsyncGenerator<MelaRecipe> {
    if ((await stat(path)).isDirectory()) {
        for (let name of (await readdir(path)).sort()) {
            let extension = extname(name);
            if (extension === RECIPE_EXTENSION || extension === ARCHIVE_EXTENSION) {
                yield* readMelaRecipes(join(path, name));
            }
        }
        return;
    }

    switch (extname(path)) {
        case RECIPE_EXTENSION:
            yield parseRecipe(await readFile(path, "utf8"), path);
            return;
        case ARCHIVE_EXTENSION:
            yield* readArchive(path);
            return;
        default:
            throw new Error(`${path}: expected a ${RECIPE_EXTENSION} or ${ARCHIVE_EXTENSION} file`);
    }
}

async function* readArchive(path: string): AsyncGenerator<MelaRecipe> {
    let zip = await yauzl.openPromise(path);
    for await (let entry of zip.eachEntry()) {
        if (
            extname(entry.fileName) !== RECIPE_EXTENSION ||
            entry.fileName.startsWith("__MACOSX/")
        ) {
            continue;
        }
        let json = await buffer(await zip.openReadStreamPromise(entry));
        yield parseRecipe(json.toString("utf8"), `${path}:${entry.fileName}`);
    }
}

function parseRecipe(json: string, location: string): MelaRecipe {
    let result = MelaRecipeSchema.safeParse(JSON.parse(json));
    if (!result.success) {
        throw new Error(`${location} is not a Mela recipe:\n${z.prettifyError(result.error)}`);
    }
    return result.data;
}
