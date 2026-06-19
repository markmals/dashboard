import { z } from "zod";
import { defineCollection, partialURL } from "~/lib/define-collection.server.ts";

const movies = defineCollection({
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

const television = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        trailer: z.url().optional(),
        poster: z.url(),
    }),
});

const events = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        thumbnail: partialURL(),
    }),
});

const theaters = defineCollection({
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

const recipes = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        source: z.url(),
        thumbnail: partialURL(),
    }),
});

const restaurants = defineCollection({
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
