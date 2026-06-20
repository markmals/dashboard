"use client";

import type React from "react";

import { LayoutGroup, motion } from "framer-motion";
import { useId } from "react";
import { Button as RACButton } from "react-aria-components";
import { useLocation } from "react-router";

import { cx } from "~/styles/cva.ts";

import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

export function Navbar({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
    return <nav {...props} className={cx(className, "flex flex-1 items-center gap-4 py-2.5")} />;
}

export function NavbarDivider({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            aria-hidden="true"
            {...props}
            className={cx(className, "h-6 w-px bg-zinc-950/10 dark:bg-white/10")}
        />
    );
}

export function NavbarSection({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    let id = useId();

    return (
        <LayoutGroup id={id}>
            <div {...props} className={cx(className, "flex items-center gap-3")} />
        </LayoutGroup>
    );
}

export function NavbarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div aria-hidden="true" {...props} className={cx(className, "-ml-4 flex-1")} />;
}

export function NavbarItem({
    ref,
    className,
    children,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
    ref?: React.Ref<HTMLAnchorElement | HTMLButtonElement>;
} & (
    | Omit<React.ComponentPropsWithoutRef<typeof RACButton>, "className">
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
)) {
    let classes = cx(
        // Base
        "relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5",
        // Leading icon/icon-only
        "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5",
        // Trailing icon (down chevron or similar)
        "*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4",
        // Avatar
        "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius)] *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6",
        // Hover
        "data-hovered:bg-zinc-950/5 data-hovered:*:data-[slot=icon]:fill-zinc-950",
        // Active
        "data-pressed:bg-zinc-950/5 data-pressed:*:data-[slot=icon]:fill-zinc-950",
        // Dark mode
        "dark:text-white dark:*:data-[slot=icon]:fill-zinc-400",
        "dark:data-hovered:bg-white/5 dark:data-hovered:*:data-[slot=icon]:fill-white",
        "dark:data-pressed:bg-white/5 dark:data-pressed:*:data-[slot=icon]:fill-white",
    );

    let location = useLocation();
    let current =
        "href" in props &&
        (props.href === "/" ? location.pathname === "/" : location.pathname.startsWith(props.href));

    return (
        <span className={cx(className, "relative")}>
            {current && (
                <motion.span
                    className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-500"
                    layoutId="current-indicator"
                />
            )}
            {"href" in props ? (
                <Link
                    {...props}
                    className={classes}
                    data-current={current ? "true" : undefined}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                >
                    <TouchTarget>{children}</TouchTarget>
                </Link>
            ) : (
                <RACButton
                    {...props}
                    className={cx("cursor-default", classes)}
                    data-current={current ? "true" : undefined}
                    ref={ref as React.Ref<HTMLButtonElement>}
                >
                    <TouchTarget>{children}</TouchTarget>
                </RACButton>
            )}
        </span>
    );
}

export function NavbarLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={cx(className, "truncate")} />;
}
