import * as Headless from "@headlessui/react"
import React from "react"
import {
    type LinkProps,
    Link as RemixLink,
    NavLink as RemixNavLink,
    type NavLinkProps,
} from "@remix-run/react"

export const Link = React.forwardRef(function Link(
    props: { href: string | LinkProps["to"] } & React.ComponentPropsWithoutRef<"a">,
    ref: React.ForwardedRef<HTMLAnchorElement>,
) {
    return (
        <Headless.DataInteractive>
            <RemixLink {...props} to={props.href} ref={ref} />
        </Headless.DataInteractive>
    )
})

export const NavLink = React.forwardRef(function Link(
    props: { href: string | NavLinkProps["to"] } & Pick<NavLinkProps, "className" | "style"> &
        Omit<React.ComponentPropsWithoutRef<"a">, "className" | "style">,
    ref: React.ForwardedRef<HTMLAnchorElement>,
) {
    return (
        <Headless.DataInteractive>
            <RemixNavLink {...props} to={props.href} ref={ref} />
        </Headless.DataInteractive>
    )
})
