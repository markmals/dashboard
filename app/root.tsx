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
import { Outlet, Scripts, ScrollRestoration } from "react-router";

import type { IconName } from "~/components/icon-names.ts";

import { Icon } from "~/components/Icon.tsx";
import tailwind from "~/styles/style.css?url";

const NAV_ITEMS = [
    // { label: "Home", url: "/", icon: "home" },
    { label: "TV Shows", url: "/tv", icon: "tv" },
    { label: "Movies", url: "/movies", icon: "movie-camera" },
    { label: "In Theaters", url: "/in-theaters", icon: "movie" },
    { label: "Activities", url: "/activities", icon: "calendar" },
    { label: "Restaurants", url: "/restaurants", icon: "dining" },
    { label: "Recipes", url: "/recipes", icon: "book" },
    // { label: "Developer Education", url: "/dev-edu", icon: "code" },
] satisfies { label: string; url: string; icon: IconName }[];

export function Layout({ children }: { children: React.ReactNode }) {
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
                                {NAV_ITEMS.map(({ label, url }) => (
                                    <NavbarItem href={url} key={label}>
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
                                    {NAV_ITEMS.map(({ label, url, icon }) => (
                                        <SidebarItem href={url} key={label}>
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
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
