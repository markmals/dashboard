import { z } from "zod";

type BaseSchemaWithoutEffects =
    | z.ZodObject<any>
    | z.ZodUnion<any>
    | z.ZodDiscriminatedUnion<any>
    | z.ZodIntersection<any, any>;

export type BaseSchema = BaseSchemaWithoutEffects | z.ZodTransform<BaseSchemaWithoutEffects, any>;

interface DataCollectionConfig<S extends BaseSchema> {
    type: "data";
    schema: S;
}

interface ContentCollectionConfig<S extends BaseSchema> {
    type: "content";
    schema: S;
}

export type CollectionConfig<S extends BaseSchema> =
    | ContentCollectionConfig<S>
    | DataCollectionConfig<S>;

export function defineCollection<
    Schema extends BaseSchema,
    Type extends "content" | "data",
>(input: { type: Type; schema: Schema }): { type: Type; schema: Schema } {
    return input as any;
}

export const partialURL = () =>
    z.string().refine(val => val.startsWith("/") || val.startsWith("http"), {
        message: "Must be a partial URL path or a full URL",
    });

export const numericalYear = () => z.number().int().gte(2000).lte(new Date().getFullYear());
