import { z } from "zod"

type BaseSchemaWithoutEffects =
    | z.AnyZodObject
    | z.ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
    | z.ZodDiscriminatedUnion<string, z.AnyZodObject[]>
    | z.ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>

export type BaseSchema = BaseSchemaWithoutEffects | z.ZodEffects<BaseSchemaWithoutEffects>

type DataCollectionConfig<S extends BaseSchema> = {
    type: "data"
    schema: S
}

type ContentCollectionConfig<S extends BaseSchema> = {
    type: "content"
    schema: S
}

export type CollectionConfig<S extends BaseSchema> =
    | ContentCollectionConfig<S>
    | DataCollectionConfig<S>

export function defineCollection<
    Schema extends BaseSchema,
    Type extends "content" | "data",
>(input: { type: Type; schema: Schema }): { type: Type; schema: Schema } {
    return input as any
}

export const partialURL = () =>
    z.string().refine(val => val.startsWith("/") || val.startsWith("http"), {
        message: "Must be a partial URL path or a full URL",
    })

export const numericalYear = () => z.number().int().gte(2000).lte(new Date().getFullYear())
