import type React from "react";
import { Link as RACLink } from "react-aria-components";
import { Link as RemixLink, NavLink as RemixNavLink } from "react-router";

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
                <RemixLink
                    {...domProps}
                    {...props}
                    ref={domRef as React.Ref<HTMLAnchorElement>}
                    to={href}
                >
                    {children}
                </RemixLink>
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
                <RemixNavLink
                    {...domProps}
                    {...props}
                    ref={domRef as React.Ref<HTMLAnchorElement>}
                    to={href}
                >
                    {children}
                </RemixNavLink>
            )}
        />
    );
};
