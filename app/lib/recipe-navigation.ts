// History state set by links on the recipe list, so a recipe page can tell the list is the history
// entry right behind it. Lives outside the client components that read it so server components can
// pass it as a prop.
export const FROM_RECIPE_LIST = { fromRecipeList: true } as const;

export function cameFromRecipeList(state: unknown): boolean {
    return typeof state === "object" && state !== null && "fromRecipeList" in state;
}
