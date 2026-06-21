import {
    Navbar,
    NavbarItem,
    NavbarSection,
    Sidebar,
    SidebarBody,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    StackedLayout,
} from "@tailwindcss/ui/index.ts";
import { Outlet } from "react-router";

import type { IconName } from "~/components/icon-names.ts";

import { Icon } from "~/components/Icon.tsx";
import { restoredHref } from "~/lib/collections.ts";
import { resolvePrefs } from "~/lib/prefs.ts";
import tailwind from "~/styles/style.css?url";

import type { Route } from "./+types/root.ts";

// Persist collection-page filter params in a cookie. There's no restore-redirect: in-app links bake
// the remembered params in (`restoredHref` in the nav below), so a bare URL is a clean reset. The
// middleware only writes/clears the cookie; pages read the live URL via `resolvePageParams`.
export const middleware: Route.MiddlewareFunction[] = [
    async ({ request }, next) => {
        let { setCookie } = await resolvePrefs(request);
        let response = await next();
        if (setCookie) response.headers.append("Set-Cookie", setCookie);
        return response;
    },
];

const NAV_ITEMS = [
    // { label: "Home", url: "/", icon: "home" },
    { label: "TV Shows", url: "/tv", icon: "tv" },
    { label: "Movies", url: "/movies", icon: "movie-camera" },
    { label: "In Theaters", url: "/in-theaters", icon: "movie" },
    { label: "Activities", url: "/activities", icon: "calendar" },
    { label: "Restaurants", url: "/restaurants", icon: "dining" },
    { label: "Recipes", url: "/recipes", icon: "book" },
    // { label: "Developer Education", url: "/dev-edu", icon: "code" },
] as const satisfies readonly { label: string; url: string; icon: IconName }[];

// The server-component counterpart of `Layout` (RR splits these: `Layout` is a client component,
// `ServerLayout` renders on the server and may be async). Being the layout, it wraps every state —
// including error boundaries — so the nav chrome is always present; being async, it can await the
// prefs cookie to bake each page's remembered sort/filter params into its nav link, so in-app
// navigation preserves them (there's no restore-redirect anymore).
export async function ServerLayout({ children }: { children: React.ReactNode }) {
    let navItems = await Promise.all(
        NAV_ITEMS.map(async item => ({ ...item, href: await restoredHref(item.url) })),
    );

    return (
        <html className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950" lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <link href={tailwind} rel="stylesheet" />
                <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
                <link href="favicon.svg" rel="icon" type="image/svg+xml" />
                <link href="apple-touch-icon.png" rel="apple-touch-icon" />
            </head>
            <body>
                <StackedLayout
                    navbar={
                        <Navbar>
                            <NavbarSection className="max-lg:hidden">
                                {navItems.map(({ label, href }) => (
                                    <NavbarItem href={href} key={label}>
                                        {label}
                                    </NavbarItem>
                                ))}
                            </NavbarSection>
                        </Navbar>
                    }
                    sidebar={
                        <Sidebar>
                            <SidebarBody>
                                <SidebarSection>
                                    {navItems.map(({ label, href, icon }) => (
                                        <SidebarItem href={href} key={label}>
                                            <Icon name={icon} />
                                            <SidebarLabel>{label}</SidebarLabel>
                                        </SidebarItem>
                                    ))}
                                </SidebarSection>
                            </SidebarBody>
                        </Sidebar>
                    }
                >
                    {children}
                </StackedLayout>
            </body>
        </html>
    );
}

export function ServerComponent() {
    return <Outlet />;
}
