import type { Tokens } from "marked";
import type { z } from "zod";

import * as path from "@std/path";
import * as YAML from "@std/yaml";
import { Renderer as MarkdownRenderer, marked as parseMarkdown } from "marked";

import { collections } from "~/content/config.server.ts";

import { Frontmatter } from "./frontmatter.server.ts";

class ParagraphStripper extends MarkdownRenderer {
    override paragraph({ tokens }: Tokens.Paragraph): string {
        return this.parser.parseInline(tokens);
    }
}

export type Collecitons = typeof collections;
export type CollectionKey = keyof Collecitons;
export type CollectionEntry<Key extends CollectionKey> = Collecitons[Key]["type"] extends "content"
    ? {
          id: string;
          slug: string;
          data: z.infer<Collecitons[Key]["schema"]>;
          body: string;
          collection: Key;
      }
    : {
          id?: string;
          data: z.infer<Collecitons[Key]["schema"]>;
          collection: Key;
      };

let content = import.meta.glob<false, string, { default: string }>(
    "/app/content/**/*.{md,json,yaml}",
    { query: "?raw" },
);

export async function getCollection<Key extends CollectionKey>(
    key: Key,
    filter?: (entry: CollectionEntry<Key>) => boolean,
): Promise<CollectionEntry<Key>[]> {
    let collection = collections[key];
    let allDirs = [...new Set(Object.keys(content).map(filePath => path.dirname(filePath)))];
    let kebabCaseKey = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

    let filteredContent = Object.entries(content)
        .filter(([filePath]) => {
            let parsedPath = path.parse(filePath);
            let contentDir = path.parse(parsedPath.dir).name;
            let camelCasedContentDir = contentDir.replace(/-([a-z])/g, (_, letter) =>
                letter.toUpperCase(),
            );
            let fileName = parsedPath.name;
            if (allDirs.includes(fileName)) {
                throw new Error(
                    `Cannot have top level file and directory in /app/content/. Found: ${fileName}${parsedPath.ext.toLowerCase()} and /app/content/${fileName}/`,
                );
            }
            return (
                camelCasedContentDir === key ||
                fileName === key ||
                filePath.includes(`/content/${kebabCaseKey}/`)
            );
        })
        .map(([filePath, file]) => [filePath, file().then(f => f.default)] as const);

    function getId(filePath: string): string | undefined {
        return filePath.split(`content/${kebabCaseKey}/`)[1]?.replace(/\.(md|json|yaml)$/, "");
    }

    let entries = (
        await Promise.all(
            collection.type === "data"
                ? filteredContent.flatMap(async ([filePath, file]) => {
                      let ext = path.extname(filePath).toLowerCase();
                      let contents = await file;
                      let parsed = ext === ".json" ? JSON.parse(contents) : YAML.parse(contents);
                      let data = Array.isArray(parsed) ? parsed : [parsed];
                      return data.map(item => ({
                          id: getId(filePath),
                          data: collection.schema.parse(item),
                          collection: key,
                      }));
                  })
                : filteredContent.map(async ([filePath, file]) => {
                      try {
                          let contents = await file;
                          let frontmatter = new Frontmatter(contents);
                          let body = await parseMarkdown(frontmatter.content, {
                              renderer: new ParagraphStripper(),
                          });
                          let data = collection.schema.parse(frontmatter.data);
                          let id = getId(filePath)!;
                          let slug = path.basename(id);
                          return {
                              id,
                              slug,
                              body,
                              data,
                              collection: key,
                          };
                      } catch (error: any) {
                          // TODO: Handle Zod errors better
                          throw new Error(`${filePath}\n${error.message}`);
                      }
                  }),
        )
    ).flat() as CollectionEntry<Key>[];

    return filter ? entries.filter(filter) : entries;
}
