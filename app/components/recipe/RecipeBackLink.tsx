"use client";

import type { MouseEvent } from "react";

import { Link, useLocation, useNavigate } from "react-router";

import { Icon } from "~/components/Icon.tsx";
import { cameFromRecipeList } from "~/lib/recipe-navigation.ts";

// Coming from the list, this steps back through history instead of pushing a fresh copy of the
// list, so the list reappears where it was scrolled (and Back doesn't then bounce between the two).
// Coming any other way, say from a shared permalink, it's a plain link to the list. React Router's
// Link rather than the kit's: the kit's passes `onClick` over React Aria's own click handling.
export function RecipeBackLink() {
    let location = useLocation();
    let navigate = useNavigate();

    function goBackToList(event: MouseEvent<HTMLAnchorElement>) {
        let plainClick =
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey;
        if (!plainClick || !cameFromRecipeList(location.state)) return;
        event.preventDefault();
        navigate(-1);
    }

    return (
        <Link
            className="-my-2 inline-flex items-center gap-1 self-start py-2 text-sm/6 font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            onClick={goBackToList}
            to="/recipes"
        >
            <Icon name="chevron-left" size={16} />
            Recipes
        </Link>
    );
}
