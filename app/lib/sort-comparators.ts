const articles = /^(a|an|the)\s+/i
const removeArticles = (title: string) => title.replace(articles, "")

export const titleSortComparator = (lhs: { title: string }, rhs: { title: string }) => {
    return removeArticles(lhs.title).localeCompare(removeArticles(rhs.title), undefined, {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: "base",
    })
}

export const nameSortComparator = (lhs: { name: string }, rhs: { name: string }) => {
    return removeArticles(lhs.name).localeCompare(removeArticles(rhs.name), undefined, {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: "base",
    })
}
