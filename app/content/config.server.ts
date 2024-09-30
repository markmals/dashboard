import { defineCollection, numericalYear, partialURL } from "~/lib/define-collection.server"
import { z } from "zod"

const movies = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.string().url(),
        year: z.string(),
        genre: z.string(),
        runningTime: z.string(),
        trailer: z.string().url(),
        poster: z.string().url(),
    }),
})

const television = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.string().url(),
        trailer: z.string().url(),
        poster: z.string().url(),
    }),
})

const events = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.string().url(),
        thumbnail: partialURL(),
    }),
})

const recipes = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        source: z.string().url(),
        thumbnail: partialURL(),
    }),
})

const restaurants = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        address: z.string(),
        cuisine: z.string(),
        menu: z.string().url().optional(),
        thumbnail: partialURL(),
    }),
})

const wwdc = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        link: z.string().url(),
        thumbnail: partialURL(),
        year: numericalYear(),
        tags: z.array(z.string()).default([]),
    }),
})

const pointFree = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        link: z.string().url(),
        thumbnail: partialURL(),
        tags: z.array(z.string()).default([]),
    }),
})

export const collections = {
    movies,
    television,
    events,
    wwdc,
    pointFree,
    recipes,
    restaurants,
}
