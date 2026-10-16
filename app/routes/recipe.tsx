import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateDescription,
    EmptyStateHeading,
    EmptyStateIcon,
} from "@tailwindcss/ui";
import { data, isRouteErrorResponse } from "react-router";
import { getEntry } from "sprinkles:content";

import { Icon } from "~/components/Icon.tsx";
import { RecipeBackLink } from "~/components/recipe/RecipeBackLink.tsx";
import { RecipeBody } from "~/components/recipe/RecipeBody.tsx";
import { RecipeHeader } from "~/components/recipe/RecipeHeader.tsx";
import { RecipeMetadata } from "~/components/recipe/RecipeMetadata.tsx";

import type { Route } from "./+types/recipe.ts";

// Looked up in the loader rather than the component so an unknown slug answers with a real 404.
export async function loader({ params }: Route.LoaderArgs) {
    let recipe = await getEntry("recipes", params.slug);
    if (!recipe) throw data(null, { status: 404 });
    return recipe;
}

export function ServerComponent({ loaderData: recipe }: Route.ServerComponentProps) {
    return (
        <>
            <RecipeMetadata recipe={recipe} />
            <article className="flex flex-col gap-10 lg:gap-12">
                <RecipeBackLink />
                <RecipeHeader recipe={recipe.data} />
                <RecipeBody recipe={recipe.data} />
            </article>
        </>
    );
}

// A shared permalink can outlive its recipe (renamed or removed), so say so instead of a bare 404.
// Anything else isn't this route's to explain; rethrowing hands it to the app's default boundary.
export function ServerErrorBoundary({ error }: Route.ServerErrorBoundaryProps) {
    if (!isRouteErrorResponse(error) || error.status !== 404) throw error;

    return (
        <>
            <title>Recipe not found • Dashboard</title>
            <EmptyState className="py-12">
                <EmptyStateIcon>
                    <Icon name="book" size={48} />
                </EmptyStateIcon>
                <EmptyStateHeading>Recipe not found</EmptyStateHeading>
                <EmptyStateDescription>
                    Nothing lives at this address anymore. The recipe may have been renamed or
                    removed.
                </EmptyStateDescription>
                <EmptyStateActions>
                    <Button href="/recipes">All recipes</Button>
                </EmptyStateActions>
            </EmptyState>
        </>
    );
}
