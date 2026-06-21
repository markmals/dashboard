import { createCookie } from "react-router";

// Per-page sort/filter preferences, persisted server-side via a proper React Router cookie (never
// `document.cookie` — its serialize/parse handles encoding for us). The value is a map of
// `pathname -> search-params string`. Read during render (`resolvePageParams` in collections.ts)
// and managed by the root `persistPrefs` middleware. HttpOnly because only the server touches it.
let prefsCookie = createCookie("dashboard-prefs", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
});

export type Prefs = Record<string, string>;

// The collection pages that persist controls, keyed by pathname. `defaultSearch` is the canonical
// search string of each page's default state (must match the route's `pickSort` fallback) — when a
// request lands on it, we treat that as "no preference" so Reset/return-to-default forgets the entry.
const PREF_PAGES: Record<string, { names: readonly string[]; defaultSearch: string }> = {
    "/movies": { names: ["sort", "genre"], defaultSearch: "sort=title" },
    "/tv": { names: ["sort", "status", "genre"], defaultSearch: "sort=status" },
    "/in-theaters": { names: ["sort", "genre"], defaultSearch: "sort=release-asc" },
};

export async function readPrefs(request: Request): Promise<Prefs> {
    let parsed: unknown = await prefsCookie.parse(request.headers.get("Cookie"));
    return parsed && typeof parsed === "object" ? (parsed as Prefs) : {};
}

// The canonical search string for a page from a URL — only the page's known params, empties dropped,
// in a stable order so it compares equal regardless of how the params were ordered in the URL.
function pagePrefSearch(url: URL, paramNames: readonly string[]): string {
    let search = new URLSearchParams();
    for (let name of paramNames) {
        let value = url.searchParams.get(name);
        if (value) search.set(name, value);
    }
    return search.toString();
}

// What the prefs middleware should do for a request: write (or clear) the remembered-filters cookie.
// Restoration is no longer a redirect — in-app links bake the remembered params in via `restoredHref`,
// so a bare URL is a deliberate reset that forgets the entry.
export interface PrefsDirective {
    setCookie?: string;
}

export async function resolvePrefs(request: Request): Promise<PrefsDirective> {
    let url = new URL(request.url);
    let page = PREF_PAGES[url.pathname];
    if (!page) return {};

    let prefs = await readPrefs(request);
    let stored = prefs[url.pathname] ?? "";

    // Remember the current filter params, treating the page's defaults — and a bare URL — as "no
    // preference" so a Reset (which navigates to the bare path) forgets the entry. In-app links carry
    // remembered params forward via `restoredHref`; only a bare or default visit clears them.
    let current = page.names.some(name => url.searchParams.has(name))
        ? pagePrefSearch(url, page.names)
        : "";
    let desired = current === page.defaultSearch ? "" : current;
    if (desired === stored) return {};
    if (desired) prefs[url.pathname] = desired;
    else delete prefs[url.pathname];
    return { setCookie: await prefsCookie.serialize(prefs) };
}
