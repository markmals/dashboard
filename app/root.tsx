import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import tailwind from "~/styles/style.css?url";
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
import { CalendarDaysIcon, CodeBracketIcon } from "@heroicons/react/16/solid";
import {
    BookOpenIcon,
    BuildingStorefrontIcon,
    FilmIcon,
    TvIcon,
} from "@heroicons/react/24/solid";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
    { rel: "icon", type: "image/svg+xml", href: "favicon.svg" },
    { rel: "apple-touch-icon", href: "apple-touch-icon.png" },
];

export const meta: MetaFunction = () => {
    return [{ title: "Summer Dashboard" }];
};

const navItems = [
    // { label: "Home", url: "/", icon: HomeIcon },
    { label: "TV Shows & Movies", url: "/tv-movies", icon: TvIcon },
    { label: "In Theaters", url: "/in-theaters", icon: FilmIcon },
    { label: "Activities", url: "/activities", icon: CalendarDaysIcon },
    { label: "Restaurants", url: "/restaurants", icon: BuildingStorefrontIcon },
    // { label: "Recipes", url: "/recipes", icon: BookOpenIcon },
    // { label: "Developer Education", url: "/dev-edu", icon: CodeBracketIcon },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <html
            lang="en"
            className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <StackedLayout
                    navbar={
                        <Navbar>
                            <NavbarSection className="max-lg:hidden">
                                {navItems.map(({ label, url }) => (
                                    <NavbarItem
                                        key={label}
                                        href={url}
                                        current={location.pathname === url}
                                    >
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
                                    {navItems.map((
                                        { label, url, icon: Icon },
                                    ) => (
                                        <SidebarItem
                                            href={url}
                                            key={label}
                                            current={location.pathname === url}
                                        >
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
