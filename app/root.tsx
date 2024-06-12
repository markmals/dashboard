import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react"
import { HeadersFunction, LinksFunction, MetaFunction } from "@vercel/remix"
import tailwind from "~/styles/style.css?url"
import { StackedLayout, Navbar, NavbarItem, NavbarSection } from "@tailwindcss/catalyst"

// export const config = { runtime: "edge" }

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
    // { label: "Home", url: "/" },
    { label: "Movies & TV Shows", url: "/tv-movies" },
    { label: "WWDC", url: "/wwdc" },
    // { label: "In Theaters", url: "/in-theaters" },
    // { label: "Recipes", url: "/recipes" },
    // { label: "Restaurants", url: "/restaurants" },
    // { label: "Events", url: "/events" },
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
                    sidebar={<div />}
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
