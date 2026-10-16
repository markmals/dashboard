import { Strong, TextLink } from "@tailwindcss/ui";

import { type InlineNode, parseInlineMarkdown } from "~/lib/inline-markdown.ts";

export function InlineMarkdown({ text }: { text: string }) {
    return <InlineNodes nodes={parseInlineMarkdown(text)} />;
}

function InlineNodes({ nodes }: { nodes: InlineNode[] }) {
    return nodes.map((node, index) => {
        switch (node.type) {
            case "text":
                return node.text;
            case "strong":
                return (
                    <Strong key={index}>
                        <InlineNodes nodes={node.children} />
                    </Strong>
                );
            case "emphasis":
                return (
                    <em key={index}>
                        <InlineNodes nodes={node.children} />
                    </em>
                );
            case "link":
                return (
                    <TextLink href={node.href} key={index} rel="noopener" target="_blank">
                        <InlineNodes nodes={node.children} />
                    </TextLink>
                );
        }
    });
}
