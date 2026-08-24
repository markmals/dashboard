import * as JSONC from "@std/jsonc";
import { defineCollection } from "@withsprinkles/content-layer";
import { file, glob } from "@withsprinkles/content-layer/loaders";
import { z } from "zod";

// Accepts a site-relative path ("/foo.webp") or an absolute URL.
function partialURL() {
    return z.string().refine(val => val.startsWith("/") || val.startsWith("http"), {
        message: "Must be a partial URL path or a full URL",
    });
}

let movies = defineCollection({
    loader: glob({ pattern: "*.json", base: "app/content/movies" }),
    schema: z.object({
        title: z.string(),
        link: z.url(),
        year: z.string(),
        genre: z.string(),
        runningTime: z.string(),
        trailer: z.url(),
        poster: z.url(),
    }),
});

let TvGenre = z.enum(["Comedy", "Drama", "Documentary"]);

let TvBase = z.object({
    title: z.string(),
    link: z.url(),
    genre: z.union([TvGenre, z.array(TvGenre)]),
    seasons: z.number().int().positive(),
    trailer: z.url().optional(),
    poster: z.url(),
    watching: z.boolean().default(false),
});

let television = defineCollection({
    loader: glob({ pattern: "*.json", base: "app/content/television" }),
    schema: z.discriminatedUnion("status", [
        TvBase.extend({ status: z.literal("ended") }),
        // `finale` is the last scheduled episode's air date for the season in progress (or the
        // one about to premiere). Optional: TMDb only has it once the full schedule is released;
        // until then a `mise run tv:refresh` later backfills it. The TV page uses these dates to
        // shift statuses at request time (upcoming → airing → returning) without a data refresh.
        TvBase.extend({ status: z.literal("airing"), finale: z.iso.date().optional() }),
        TvBase.extend({ status: z.literal("returning") }),
        TvBase.extend({
            status: z.literal("upcoming"),
            premiere: z.iso.date(),
            finale: z.iso.date().optional(),
        }),
    ]),
});

let events = defineCollection({
    loader: file("app/content/events.json"),
    schema: z.object({
        title: z.string(),
        link: z.url(),
        thumbnail: partialURL(),
    }),
});

let theaters = defineCollection({
    loader: file("app/content/theaters.jsonc", {
        parser: text => JSONC.parse(text) as any,
    }),
    schema: z.object({
        title: z.string(),
        link: z.url(),
        release: z.iso.date(),
        genre: z.string(),
        runningTime: z.string().optional(),
        trailer: z.url().optional(),
        poster: z.url().optional(),
    }),
});

let recipes = defineCollection({
    loader: glob({ pattern: "*.md", base: "app/content/recipes" }),
    schema: z.object({
        title: z.string(),
        source: z.url(),
        thumbnail: partialURL(),
    }),
});

let restaurants = defineCollection({
    loader: glob({ pattern: "*.md", base: "app/content/restaurants" }),
    schema: z.object({
        name: z.string(),
        address: z.string(),
        cuisine: z.string(),
        menu: z.url().optional(),
        thumbnail: partialURL(),
    }),
});

export let collections = { movies, television, events, theaters, recipes, restaurants };
