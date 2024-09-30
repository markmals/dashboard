import { Frontmatter } from "./frontmatter.server"
import { marked as parseMarkdown, Renderer as MarkdownRenderer, Tokens } from "marked"
import * as path from "@std/path"
import * as YAML from "@std/yaml"
import { z } from "zod"
import { collections } from "~/content/config.server"

class ParagraphStripper extends MarkdownRenderer {
    override paragraph({ tokens }: Tokens.Paragraph): string {
        return this.parser.parseInline(tokens)
    }
}

export type Collecitons = typeof collections
export type CollectionKey = keyof Collecitons
export type CollectionEntry<Key extends CollectionKey> = Collecitons[Key]["type"] extends "content"
    ? {
          id: string
          slug: string
          data: z.infer<Collecitons[Key]["schema"]>
          body: string
          collection: Key
      }
    : {
          id?: string
          data: z.infer<Collecitons[Key]["schema"]>
          collection: Key
      }

const content = import.meta.glob<false, string, { default: string }>(
    "/app/content/**/*.{md,json,yaml}",
    { query: "?raw" },
)

export async function getCollection<Key extends CollectionKey>(
    key: Key,
    filter?: (entry: CollectionEntry<Key>) => boolean,
): Promise<CollectionEntry<Key>[]> {
    const collection = collections[key]
    const allDirs = [...new Set(Object.keys(content).map(filePath => path.dirname(filePath)))]
    const kebabCaseKey = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

    const filteredContent = Object.entries(content)
        .filter(([filePath]) => {
            const parsedPath = path.parse(filePath)
            const contentDir = path.parse(parsedPath.dir).name
            const camelCasedContentDir = contentDir.replace(/-([a-z])/g, (_, letter) =>
                letter.toUpperCase(),
            )
            const fileName = parsedPath.name
            if (allDirs.includes(fileName)) {
                throw new Error(
                    `Cannot have top level file and directory in /app/content/. Found: ${fileName}${parsedPath.ext.toLowerCase()} and /app/content/${fileName}/`,
                )
            }
            return (
                camelCasedContentDir === key ||
                fileName === key ||
                filePath.includes(`/content/${kebabCaseKey}/`)
            )
        })
        .map(([filePath, file]) => [filePath, file().then(f => f.default)] as const)

    function getId(filePath: string): string | undefined {
        return filePath.split(`content/${kebabCaseKey}/`)[1]?.replace(/\.(md|json|yaml)$/, "")
    }

    const entries = (
        await Promise.all(
            collection.type === "data"
                ? filteredContent
                      .map(async ([filePath, file]) => {
                          const ext = path.extname(filePath).toLowerCase()
                          const contents = await file
                          const parsed =
                              ext === ".json" ? JSON.parse(contents) : YAML.parse(contents)
                          const data = Array.isArray(parsed) ? parsed : [parsed]
                          return data.map(item => ({
                              id: getId(filePath),
                              data: collection.schema.parse(item),
                              collection: key,
                          }))
                      })
                      // This could be multiple files or
                      // it could be one file with a top level array full of objects
                      .flat()
                : filteredContent.map(async ([filePath, file]) => {
                      try {
                          const contents = await file
                          const frontmatter = new Frontmatter(contents)
                          const body = await parseMarkdown(frontmatter.content, {
                              renderer: new ParagraphStripper(),
                          })
                          const data = collection.schema.parse(frontmatter.data)
                          const id = getId(filePath)!
                          const slug = path.basename(id)
                          return {
                              id,
                              slug,
                              body,
                              data,
                              collection: key,
                          }
                      } catch (error: any) {
                          // TODO: Handle Zod errors better
                          throw new Error(`${filePath}\n${error.message}`)
                      }
                  }),
        )
    ).flat() as CollectionEntry<Key>[]

    return filter ? entries.filter(filter) : entries
}
