import { z } from "zod"
import { defineCollection, partialURL } from "~/lib/define-collection.server"

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
})

const television = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        trailer: z.url().optional(),
        poster: z.url(),
    }),
})

const events = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        link: z.url(),
        thumbnail: partialURL(),
    }),
})

const theaters = defineCollection({
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
})

const recipes = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        source: z.url(),
        thumbnail: partialURL(),
    }),
})

const restaurants = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        address: z.string(),
        cuisine: z.string(),
        menu: z.url().optional(),
        thumbnail: partialURL(),
    }),
})

export const collections = {
    movies,
    television,
    events,
    recipes,
    restaurants,
    theaters,
}
