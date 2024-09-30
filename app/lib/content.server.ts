import { Frontmatter } from "./frontmatter.server"
import { marked as parseMarkdown } from "marked"
import * as path from "@std/path"
import * as YAML from "@std/yaml"
import { z } from "zod"
import { collections } from "~/content/config.server"

export type Collecitons = typeof collections
export type CollectionKey = keyof Collecitons
export type CollectionEntry<C extends CollectionKey> = Collecitons[C]["type"] extends "content"
    ? {
          slug: string
          data: z.infer<Collecitons[C]["schema"]>
          body: string
          collection: C
      }
    : {
          data: z.infer<Collecitons[C]["schema"]>
          collection: C
      }

const collectionFiles = import.meta.glob<true, string, { default: string }>(
    "/app/content/**/*.{md,json,yaml}",
    { eager: true, query: "?raw" },
)

export async function getCollection<C extends CollectionKey>(
    key: C,
): Promise<CollectionEntry<C>[]> {
    const collection = collections[key]

    const allDirs = [
        ...new Set(Object.keys(collectionFiles).map(filePath => path.dirname(filePath))),
    ]

    const filteredFiles = Object.entries(collectionFiles).filter(([filePath]) => {
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
        return camelCasedContentDir === key || fileName === key
    })

    return (
        collection.type === "data"
            ? filteredFiles
                  .map(([filePath, file]) => {
                      const ext = path.extname(filePath).toLowerCase()
                      const parsed =
                          ext === ".json" ? JSON.parse(file.default) : YAML.parse(file.default)
                      const data = Array.isArray(parsed) ? parsed : [parsed]
                      return data.map(item => ({
                          data: collection.schema.parse(item),
                          collection: key,
                      }))
                  })
                  .flat()
            : await Promise.all(
                  filteredFiles.map(async ([filePath, file]) => {
                      try {
                          const frontmatter = new Frontmatter(file.default)
                          const body = await parseMarkdown(frontmatter.content)
                          const data = collection.schema.parse(frontmatter.data)
                          return {
                              slug: path.parse(filePath).name,
                              body,
                              data,
                              collection: key,
                          }
                      } catch (error: any) {
                          throw new Error(`${filePath}\nZod: ${error.message}`)
                      }
                  }),
              )
    ) as CollectionEntry<C>[]
}
