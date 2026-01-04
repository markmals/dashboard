import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { BuildingStorefrontIcon, CameraIcon, FilmIcon, TvIcon } from "@heroicons/react/24/solid";
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
} from "@tailwindcss/ui";
import { Outlet, Scripts, ScrollRestoration } from "react-router";
import tailwind from "~/styles/style.css?url";

const navItems = [
    // { label: "Home", url: "/", icon: HomeIcon },
    { label: "TV Shows", url: "/tv", icon: TvIcon },
    { label: "Movies", url: "/movies", icon: CameraIcon },
    { label: "In Theaters", url: "/in-theaters", icon: FilmIcon },
    { label: "Activities", url: "/activities", icon: CalendarDaysIcon },
    { label: "Restaurants", url: "/restaurants", icon: BuildingStorefrontIcon },
    // { label: "Recipes", url: "/recipes", icon: BookOpenIcon },
    // { label: "Developer Education", url: "/dev-edu", icon: CodeBracketIcon },
];

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
                                {navItems.map(({ label, url }) => (
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
                                    {navItems.map(({ label, url, icon: Icon }) => (
                                        <SidebarItem href={url} key={label}>
                                            <Icon />
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
