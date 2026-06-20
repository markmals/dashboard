import type { DataEntry, InferSchemaOutput, ResolveSchema } from "@withsprinkles/content-layer";

import type { collections } from "~/content.config.ts";

// Mirrors the `CollectionEntry<C>` type that @withsprinkles/content-layer generates inside the
// (non-exported) `sprinkles:content` module declaration, but resolved through the `~/` alias so
// type-only consumers (cells, sort comparators) can import it. Structurally identical to the
// generated type, so values returned by `getCollection`/`getEntry` are assignable to it.
type Collections = typeof collections;
type CollectionKey = keyof Collections;

export type CollectionEntry<C extends CollectionKey> = DataEntry<
    InferSchemaOutput<ResolveSchema<Collections[C]["schema"]>>
> & { collection: C };
