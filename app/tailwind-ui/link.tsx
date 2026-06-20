"use client";

import type React from "react";

import { Link as RACLink } from "react-aria-components";
import { Link as RRLink, NavLink as RRNavLink } from "react-router";

export const Link = function Link({
    ref,
    href,
    children,
    ...props
}: {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
} & React.ComponentPropsWithoutRef<"a">) {
    return (
        <RACLink
            href={href}
            ref={ref}
            render={({ ref: domRef, className: _, ...domProps }) => (
                <RRLink
                    {...domProps}
                    {...props}
                    ref={domRef as React.Ref<HTMLAnchorElement>}
                    to={href}
                >
                    {children}
                </RRLink>
            )}
        />
    );
};

export const NavLink = function Link({
    ref,
    href,
    children,
    ...props
}: {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
} & React.ComponentPropsWithoutRef<"a">) {
    return (
        <RACLink
            href={href}
            ref={ref}
            render={({ ref: domRef, className: _, ...domProps }) => (
                <RRNavLink
                    {...domProps}
                    {...props}
                    ref={domRef as React.Ref<HTMLAnchorElement>}
                    to={href}
                >
                    {children}
                </RRNavLink>
            )}
        />
    );
};
