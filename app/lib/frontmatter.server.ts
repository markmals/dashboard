import { parse } from "@std/yaml"

type DataProps = {
    lines: string[]
    metaIndices: number[]
}
/**
 * Type definition for Front matter result
 */
export type FrontmatterResult<T> = {
    /**
     *  Yaml data form a markdown files
     */
    data: T
    /**
     * Body content of markdown file
     */
    content: string
}

/**
 * ### Retrieves the frontmatter data and content from markdown contents.
 *
 * Class for parsing front matter from a markdown content string.
 *
 * Parses metadata and content from markdown content based on metadata delimiters.
 *
 * #### Input
 *
 * - Markdown contents.
 *
 * #### Return
 *
 * - An object containing the frontmatter data and content.
 *
 *   1. data: A record of key-value pairs representing the frontmatter data.
 *
 *   2. content: The content of the file.
 *
 *
 * @example
 *
 * `example.md`
 *
 * ```md
 * ---
 * type: "post"
 * title: "Hello World"
 * ---
 * ## Hello
 * ```
 *
 * `NODE-JS`
 *
 *
 *`index.ts`
 *
 * ```ts
 * import Frontmatter from "@burmajs/frontmatter";
 * import fs from "node:fs";
 *
 * type MyType = {
 *   type: string;
 *   title: string;
 * }
 * const mdcontent = fs.readFileSync("a.md", "utf-8");
 * const foo = new Frontmatter<MyType>(mdcontent);
 *
 * console.log(foo.json); // { data: { type: 'post', title: 'Hello World' }, content: '\n\n## Hello\n'}
 * console.log(foo.data); // { type: 'post', title: 'Hello World' }
 * console.log(foo.content); // ## Hello
 * ```
 *
 *
 *
 * `DENO`
 *
 * `mod.ts`
 *
 *
 * ```ts
 * import { Frontmatter } from "@burmajs/frontmatter";
 *
 * type MyType = {
 *  type: string;
 *  title: string;
 * };
 *
 * const mdcontent = Deno.readTextFileSync("example.md");
 * const foo = new Frontmatter<MyType>(mdcontent);
 *
 *
 * console.log(foo.json); // { data: { type: 'post', title: 'Hello World' }, content: '\n\n## Hello\n'}
 * console.log(foo.data); // { type: 'post', title: 'Hello World' }
 * console.log(foo.content); // ## Hello
 * ```
 *
 *
 */
export class Frontmatter<T> {
    private _mdcontent: string
    private _lines: string[]
    private _metaIndices: number[]
    constructor(mdcontent: string) {
        this._mdcontent = mdcontent
        this._lines = this._mdcontent.split("\n")
        this._metaIndices = this._lines.reduce(this.findMetaIndices, [] as number[])
    }
    /**
     * Finds and returns the indices of lines starting with '---' in the given array.
     *
     * @param mem - An array of numbers representing indices of lines with metadata delimiters.
     * @param item - The current line being checked for metadata delimiter.
     * @param i - The index of the current line in the array.
     * @returns An updated array of indices with the new index if a metadata delimiter is found.
     */
    private findMetaIndices(mem: number[], item: string, i: number): number[] {
        // If the line starts with ---, it's a metadata delimiter
        if (/^---/.test(item)) {
            // Add the index of the line to the array of indices
            mem.push(i)
        }

        return mem
    }
    /**
     * Retrieves and parses the data from the provided 'linesProps' based on the metadata indices.
     *
     * @template T - The type of data to be returned.
     * @param linesProps - An object containing 'lines' as an array of strings and 'metaIndices' as an array of numbers.
     * @returns The parsed data of type T extracted from the specified lines, or an empty object if no metadata indices are found.
     */
    private getData<T>(linesProps: DataProps): FrontmatterResult<T>["data"] {
        const { lines, metaIndices } = linesProps
        if (metaIndices.length > 0) {
            const data = lines.slice(metaIndices[0] + 1, metaIndices[1])

            return parse(data.join("\n")) as T
        }
        return {} as T
    }
    /**
     * Retrieves frontmatter data and content from the provided markdown content.
     *
     * @template T - The type of data to be extracted.
     * @param content - The markdown content from which to extract frontmatter data and content.
     * @returns An object containing the frontmatter data and content.
     *   - data: A record of key-value pairs representing the frontmatter data.
     *   - content: The content of the markdown file.
     */
    private getContent(linesProps: DataProps): string {
        const { lines, metaIndices } = linesProps
        const content =
            metaIndices.length > 0 ? lines.slice(metaIndices[1] + 1).join("\n") : lines.join("\n")

        return content.trim() === "undefined" ? "" : content.trim()
    }
    /**
     * Get YAML data
     *
     * @returns data: The parsed front matter data of type T.
     */
    get data(): T {
        return this.getData({ lines: this._lines, metaIndices: this._metaIndices })
    }
    /**
     * Get Markdown contents
     *
     * @returns  content: The body content of the markdown file.
     */
    get content(): string {
        return this.getContent({
            lines: this._lines,
            metaIndices: this._metaIndices,
        })
    }
    /**
     * Extracted front matter data and content from the markdown content.
     *
     * @template T - The type of data to be extracted.
     * @returns An object containing the front matter data and content.
     *   - data: The parsed front matter data of type T.
     *   - content: The body content of the markdown file.
     */
    get json(): FrontmatterResult<T> {
        return {
            data: this.data,
            content: this.content,
        }
    }
}
