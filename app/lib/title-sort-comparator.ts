export const titleSortComparator = (lhs: { title: string }, rhs: { title: string }) => {
    // const articles = ["a", "an", "the"].join("|")
    // const regex = new RegExp("^(?:(" + articles + ") )(.*)$")
    // const replacer = (_: string, $1: string, $2: string) => {
    //     console.log($1, $2)
    //     return $2
    // }

    return (
        lhs.title
            // .replace(regex, replacer)
            .localeCompare(
                rhs.title,
                // .replace(regex, replacer)
                undefined,
                {
                    ignorePunctuation: true,
                    numeric: true,
                    sensitivity: "base",
                },
            )
    )
}
