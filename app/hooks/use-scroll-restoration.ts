"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

// Pages scroll in one of two places: the window on small screens, or the layout's content card on
// large ones. React Router's <ScrollRestoration> only knows about the window, so this does the same
// job for both: Back/Forward return to where that history entry was left, a link to another page
// starts at the top, and a same-page navigation (a filter change) stays put.

interface ScrollPosition {
    window: number;
    container: number;
}

const STORAGE_KEY = "dashboard-scroll-positions";

// Keyed by history entry (`location.key`), which React Router keeps in history.state, so a reload
// finds its entry's position again.
let positions: Record<string, ScrollPosition> = readStoredPositions();

export function useScrollRestoration(container: RefObject<HTMLElement | null>): void {
    let { key, pathname } = useLocation();
    let navigationType = useNavigationType();
    let shown = useRef<{ key: string; pathname: string } | null>(null);

    // The browser's own restoration fires on popstate, against the page that's still on screen
    // while the previous one loads, so take over from it. Positions are saved for reloads.
    useEffect(() => {
        history.scrollRestoration = "manual";
        let save = () => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
        window.addEventListener("pagehide", save);
        return () => window.removeEventListener("pagehide", save);
    }, []);

    // Recorded as the user scrolls rather than on the way out: by the time the next page commits, its
    // shorter content may already have clamped the outgoing offset.
    useEffect(() => {
        let element = container.current;
        if (!element) return;
        let record = () => {
            if (!shown.current) return;
            positions[shown.current.key] = { window: window.scrollY, container: element.scrollTop };
        };
        window.addEventListener("scroll", record, { passive: true });
        element.addEventListener("scroll", record, { passive: true });
        return () => {
            window.removeEventListener("scroll", record);
            element.removeEventListener("scroll", record);
        };
    }, [container]);

    useLayoutEffect(() => {
        let previous = shown.current;
        shown.current = { key, pathname };
        if (previous?.key === key) return;

        // The first render is a fresh load or a reload: restore only what this entry saved.
        let saved = navigationType === "POP" || !previous ? positions[key] : undefined;
        if (saved) {
            applyScrollPosition(container.current, saved);
        } else if (previous && previous.pathname !== pathname) {
            applyScrollPosition(container.current, { window: 0, container: 0 });
        }
    }, [container, key, pathname, navigationType]);
}

function applyScrollPosition(container: HTMLElement | null, position: ScrollPosition): void {
    container?.scrollTo(0, position.container);
    window.scrollTo(0, position.window);
}

function readStoredPositions(): Record<string, ScrollPosition> {
    if (typeof sessionStorage === "undefined") return {};
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
        // A value this app didn't write (or a truncated one) shouldn't take the layout down with it.
        return {};
    }
}
