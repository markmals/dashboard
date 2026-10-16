import { href } from "react-router";

import type { CollectionEntry } from "~/lib/content-types.ts";

import { absoluteUrl } from "~/lib/collections.ts";
import { parseInlineMarkdown, toPlainText } from "~/lib/inline-markdown.ts";

// Document title, canonical URL, and link-preview tags. iMessage, Slack, and most other unfurlers
// read OpenGraph; X reads `twitter:card` and falls back to the og:* title, description, and image.
// Preview fetchers resolve nothing relative, hence the absolute URLs. React hoists all of these
// into <head>.
export function RecipeMetadata({ recipe: { id, data } }: { recipe: CollectionEntry<"recipes"> }) {
    let url = absoluteUrl(href("/recipes/:slug", { slug: id }));
    let description = data.description && toPlainText(parseInlineMarkdown(data.description));
    let image = data.image && absoluteUrl(data.image);

    return (
        <>
            <title>{`${data.title} • Dashboard`}</title>
            <link href={url} rel="canonical" />
            {description && <meta content={description} name="description" />}
            <meta content="Dashboard" property="og:site_name" />
            <meta content="article" property="og:type" />
            <meta content={url} property="og:url" />
            <meta content={data.title} property="og:title" />
            {description && <meta content={description} property="og:description" />}
            {image && <meta content={image} property="og:image" />}
            {image && <meta content={data.title} property="og:image:alt" />}
            <meta content={image ? "summary_large_image" : "summary"} name="twitter:card" />
        </>
    );
}
