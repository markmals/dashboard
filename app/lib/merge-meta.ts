import type { MetaFunction } from "react-router"

type TitleFunction = (args: { parentTitle: string }) => ReturnType<MetaFunction>

type MergeMetaOptions = {
    filterTitleFromParent: boolean
}

export function mergeMeta(
    fn: TitleFunction,
    options: MergeMetaOptions = { filterTitleFromParent: true },
): MetaFunction {
    return ({ matches }: any) => {
        const parentMeta = matches.flatMap((match: any) => match.meta ?? [])
        const merge = options.filterTitleFromParent
            ? parentMeta.filter((meta: any) => !("title" in meta))
            : parentMeta
        const titleResult = fn({ parentTitle: (parentMeta.find((m: any) => "title" in m) as any)?.title })
        return [...merge, ...(Array.isArray(titleResult) ? titleResult : [titleResult])]
    }
}
