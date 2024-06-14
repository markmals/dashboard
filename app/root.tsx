import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react"
import { HeadersFunction, LinksFunction, MetaFunction } from "@vercel/remix"
import tailwind from "~/styles/style.css?url"
import {
    StackedLayout,
    Navbar,
    NavbarItem,
    NavbarSection,
    Sidebar,
    SidebarBody,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from "@tailwindcss/ui"
import { FilmIcon, CodeBracketIcon, CalendarDaysIcon } from "@heroicons/react/16/solid"
import { TvIcon, HomeIcon, BookOpenIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid"

export const config = { runtime: "edge" }

// https://vercel.com/docs/edge-network/caching#limits
// export const headers: HeadersFunction = () => ({
//     "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
// })

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
    // { rel: "icon", type: "image/png", href: "favicon.png" },
]

export const meta: MetaFunction = () => {
    return [{ title: "Summer Dashboard" }]
}

const navItems = [
    // { label: "Home", url: "/", icon: HomeIcon },
    { label: "TV Shows & Movies", url: "/tv-movies", icon: TvIcon },
    { label: "In Theaters", url: "/in-theaters", icon: FilmIcon },
    { label: "Events", url: "/events", icon: CalendarDaysIcon },
    { label: "Restaurants", url: "/restaurants", icon: BuildingStorefrontIcon },
    // { label: "Recipes", url: "/recipes", icon: BookOpenIcon },
    { label: "WWDC", url: "/wwdc", icon: CodeBracketIcon },
]

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation()

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                                    {navItems.map(({ label, url, icon: Icon }) => (
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
    )
}

export default function App() {
    return <Outlet />
}
