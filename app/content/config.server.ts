import { z } from "zod";

import { defineCollection, partialURL } from "~/lib/define-collection.server.ts";

let movies = defineCollection({
    type: "data",
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
    // Defaults to false and is omitted from the data files; add `"watching": true` per show.
    watching: z.boolean().default(false),
});

let television = defineCollection({
    type: "data",
    // Discriminated on `status`: `premiere` (the next premiere date) is required on and unique
    // to `upcoming`, which means "not ended, with a known future date" — whether a brand-new
    // series or a dated returning season. `returning` is "not ended, no date scheduled yet".
    // These fields (status/seasons/premiere) drift over time — refresh via `mise run tv:refresh`.
    schema: z.discriminatedUnion("status", [
        TvBase.extend({ status: z.literal("ended") }),
        TvBase.extend({ status: z.literal("airing") }),
        TvBase.extend({ status: z.literal("returning") }),
        TvBase.extend({ status: z.literal("upcoming"), premiere: z.iso.date() }),
    ]),
});

let events = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        thumbnail: partialURL(),
    }),
});

let theaters = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        release: z.iso.date(),
        genre: z.string(),
        runningTime: z.string().optional(),
        // Optional so upcoming titles can be stored before a trailer/poster exists on TMDb;
        // the in-theaters route hides any entry missing these (see in-theaters.tsx).
        trailer: z.url().optional(),
        poster: z.url().optional(),
    }),
});

let recipes = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        source: z.url(),
        thumbnail: partialURL(),
    }),
});

let restaurants = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        address: z.string(),
        cuisine: z.string(),
        menu: z.url().optional(),
        thumbnail: partialURL(),
    }),
});

export const collections = {
    movies,
    television,
    events,
    recipes,
    restaurants,
    theaters,
};
