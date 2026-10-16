// Mela's inline Markdown (https://mela.recipes/fileformat/): [links](url), **bold**, and *italic*.
// Parsed into nodes rather than HTML so React escapes all text. Links only survive for http(s) URLs;
// anything else (a `javascript:` URL in imported text, say) renders as its plain link text.

export type InlineNode =
    | { type: "text"; text: string }
    | { type: "strong" | "emphasis"; children: InlineNode[] }
    | { type: "link"; href: string; children: InlineNode[] };

const INLINE_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*(?=\S)(.+?)(?<=\S)\*/g;
const WEB_URL_RE = /^https?:\/\//i;

export function parseInlineMarkdown(source: string): InlineNode[] {
    let nodes: InlineNode[] = [];
    let cursor = 0;
    for (let match of source.matchAll(INLINE_RE)) {
        let [whole, linkText, href, strong, emphasis] = match;
        if (match.index > cursor) {
            nodes.push({ type: "text", text: source.slice(cursor, match.index) });
        }
        if (linkText !== undefined) {
            nodes.push(
                WEB_URL_RE.test(href)
                    ? { type: "link", href, children: parseInlineMarkdown(linkText) }
                    : { type: "text", text: linkText },
            );
        } else if (strong !== undefined) {
            nodes.push({ type: "strong", children: parseInlineMarkdown(strong) });
        } else {
            nodes.push({ type: "emphasis", children: parseInlineMarkdown(emphasis) });
        }
        cursor = match.index + whole.length;
    }
    if (cursor < source.length) nodes.push({ type: "text", text: source.slice(cursor) });
    return nodes;
}

// The text a reader sees, for places that can't hold markup (meta descriptions, link previews).
export function toPlainText(nodes: InlineNode[]): string {
    return nodes
        .map(node => (node.type === "text" ? node.text : toPlainText(node.children)))
        .join("");
}
