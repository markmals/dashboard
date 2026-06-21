"use client";

import { useSyncExternalStore } from "react";

// SSR-safe media-query subscription. Used to pick the controls' expand axis (inline width on
// desktop vs. a drop-down height on mobile); the server snapshot returns `false` so the first
// client paint matches SSR — by the time anything animates, hydration has corrected it.
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        callback => {
            let mql = window.matchMedia(query);
            mql.addEventListener("change", callback);
            return () => mql.removeEventListener("change", callback);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}
