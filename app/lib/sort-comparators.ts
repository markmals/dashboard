import type { CollectionEntry } from "./content.server";

const articles = /^(a|an|the)\s+/i;
const removeArticles = (title: string) => title.replace(articles, "");

interface Titled { title: string; }

export const titleSortComparator = (lhs: Titled, rhs: Titled) => {
    return removeArticles(lhs.title).localeCompare(removeArticles(rhs.title), undefined, {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: "base",
    });
};

interface Named { name: string; }

export const nameSortComparator = (lhs: Named, rhs: Named) => {
    return removeArticles(lhs.name).localeCompare(removeArticles(rhs.name), undefined, {
        ignorePunctuation: true,
        numeric: true,
        sensitivity: "base",
    });
};

interface Year { year: number; }

export const yearSortComparator = (lhs: Year, rhs: Year) => {
    return lhs.year - rhs.year;
};

interface Identifiable { id: string; }

export const idSortComparator = (lhs: Identifiable, rhs: Identifiable) => {
    return parseInt(lhs.id) - parseInt(rhs.id);
};

export const withContent = <T>(comparator: (lhs: T, rhs: T) => number) => {
    return (lhs: CollectionEntry<any>, rhs: CollectionEntry<any>) => {
        return comparator(lhs.data, rhs.data);
    };
};

export function combineComparators<T>(
    ...comparators: ((lhs: T, rhs: T) => number)[]
): (lhs: T, rhs: T) => number {
    return (a: T, b: T): number =>
        comparators.reduce((result, comparator) => result || comparator(a, b), 0);
}
