"use client";

import type { VariantProps } from "cva";
import type React from "react";

import { Button as RACButton } from "react-aria-components";

import { cva, cx } from "~/styles/cva.ts";

import { Link } from "./link.tsx";

let buttonBase = cva({
    base: [
        // Base
        "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6",
        // Sizing
        "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
        // Focus
        "focus:outline-hidden data-focus-visible:outline-solid data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-blue-500",
        // Disabled — fade the whole control uniformly so the label stays legible
        // on dark/solid buttons in both themes (recoloring text to black/35 left
        // it invisible on a dark button background).
        "data-disabled:opacity-50",
        // Icon
        "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hovered:[--btn-icon:ButtonText]",
    ],
    variants: {
        variant: {
            solid: [
                // Semibold font
                "font-semibold",
                // Optical border, implemented as the button background to avoid corner artifacts
                "border-transparent bg-(--btn-border)",
                // Dark mode: border is rendered on `after` so background is set to button background
                "dark:bg-(--btn-bg)",
                // Button background, implemented as foreground layer to stack on top of pseudo-border layer
                "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)",
                // Drop shadow, applied to the inset `before` layer so it blends with the border
                "before:shadow-sm",
                // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                "dark:before:hidden",
                // Dark mode: Subtle white outline is applied using a border
                "dark:border-white/5",
                // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
                "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]",
                // Inner highlight shadow
                "after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
                // White overlay on hover
                "data-pressed:after:bg-(--btn-hover-overlay) data-hovered:after:bg-(--btn-hover-overlay)",
                // Dark mode: `after` layer expands to cover entire button
                "dark:after:-inset-px dark:after:rounded-lg",
                // Disabled
                "data-disabled:before:shadow-none data-disabled:after:shadow-none",
            ],
            outline: [
                // Base
                "border-zinc-950/10 text-zinc-950 data-pressed:bg-zinc-950/2.5 data-hovered:bg-zinc-950/2.5",
                // Semibold font
                "font-semibold",
                // Dark mode
                "dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-pressed:bg-white/5 dark:data-hovered:bg-white/5",
                // Icon
                "[--btn-icon:var(--color-zinc-500)] data-pressed:[--btn-icon:var(--color-zinc-700)] data-hovered:[--btn-icon:var(--color-zinc-700)] dark:data-pressed:[--btn-icon:var(--color-zinc-400)] dark:data-hovered:[--btn-icon:var(--color-zinc-400)]",
            ],
            plain: [
                // Base
                "border-transparent data-pressed:bg-zinc-950/5 data-hovered:bg-zinc-950/5",
                // Normal font
                "font-normal",
                // Dark mode
                "dark:data-pressed:bg-white/10 dark:data-hovered:bg-white/10",
                // Icon
                "[--btn-icon:var(--color-zinc-500)] data-pressed:[--btn-icon:var(--color-zinc-700)] data-hovered:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-pressed:[--btn-icon:var(--color-zinc-400)] dark:data-hovered:[--btn-icon:var(--color-zinc-400)]",
            ],
            soft: [
                // Base — a persistent accent tint so the button shape is always visible. It deepens
                // on hover without becoming prominent. The accent color comes from `--btn-soft`,
                // which `buttonSoftColor` sets from the `color` prop (so `soft` composes with `color`,
                // defaulting to blue), so text/background/icon all stay in sync.
                "border-transparent font-normal",
                "text-(--btn-soft)",
                "bg-(--btn-soft)/10 data-pressed:bg-(--btn-soft)/20 data-hovered:bg-(--btn-soft)/20",
                // Icon
                "[--btn-icon:var(--btn-soft)]",
                // Disabled — fully desaturate to neutral grey (on top of the base opacity fade).
                "data-disabled:[--btn-soft:var(--color-zinc-500)] dark:data-disabled:[--btn-soft:var(--color-zinc-400)]",
            ],
        },
    },
    defaultVariants: {
        variant: "solid",
    },
});

let buttonColor = cva({
    variants: {
        color: {
            "dark/zinc": [
                "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
                "dark:text-white dark:[--btn-bg:var(--color-zinc-600)] dark:[--btn-hover-overlay:var(--color-white)]/5",
                "[--btn-icon:var(--color-zinc-400)] data-pressed:[--btn-icon:var(--color-zinc-300)] data-hovered:[--btn-icon:var(--color-zinc-300)]",
            ],
            light: [
                "text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-pressed:[--btn-border:var(--color-zinc-950)]/15 data-hovered:[--btn-border:var(--color-zinc-950)]/15",
                "dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]",
                "[--btn-icon:var(--color-zinc-500)] data-pressed:[--btn-icon:var(--color-zinc-700)] data-hovered:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-pressed:[--btn-icon:var(--color-zinc-400)] dark:data-hovered:[--btn-icon:var(--color-zinc-400)]",
            ],
            "dark/white": [
                "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
                "dark:text-zinc-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:var(--color-zinc-950)]/5",
                "[--btn-icon:var(--color-zinc-400)] data-pressed:[--btn-icon:var(--color-zinc-300)] data-hovered:[--btn-icon:var(--color-zinc-300)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-pressed:[--btn-icon:var(--color-zinc-400)] dark:data-hovered:[--btn-icon:var(--color-zinc-400)]",
            ],
            dark: [
                "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
                "dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]",
                "[--btn-icon:var(--color-zinc-400)] data-pressed:[--btn-icon:var(--color-zinc-300)] data-hovered:[--btn-icon:var(--color-zinc-300)]",
            ],
            white: [
                "text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-pressed:[--btn-border:var(--color-zinc-950)]/15 data-hovered:[--btn-border:var(--color-zinc-950)]/15",
                "dark:[--btn-hover-overlay:var(--color-zinc-950)]/5",
                "[--btn-icon:var(--color-zinc-400)] data-pressed:[--btn-icon:var(--color-zinc-500)] data-hovered:[--btn-icon:var(--color-zinc-500)]",
            ],
            zinc: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-zinc-600)] [--btn-border:var(--color-zinc-700)]/90",
                "dark:[--btn-hover-overlay:var(--color-white)]/5",
                "[--btn-icon:var(--color-zinc-400)] data-pressed:[--btn-icon:var(--color-zinc-300)] data-hovered:[--btn-icon:var(--color-zinc-300)]",
            ],
            indigo: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-indigo-500)] [--btn-border:var(--color-indigo-600)]/90",
                "[--btn-icon:var(--color-indigo-300)] data-pressed:[--btn-icon:var(--color-indigo-200)] data-hovered:[--btn-icon:var(--color-indigo-200)]",
            ],
            cyan: [
                "text-cyan-950 [--btn-bg:var(--color-cyan-300)] [--btn-border:var(--color-cyan-400)]/80 [--btn-hover-overlay:var(--color-white)]/25",
                "[--btn-icon:var(--color-cyan-500)]",
            ],
            red: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-red-600)] [--btn-border:var(--color-red-700)]/90",
                "[--btn-icon:var(--color-red-300)] data-pressed:[--btn-icon:var(--color-red-200)] data-hovered:[--btn-icon:var(--color-red-200)]",
            ],
            orange: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-orange-500)] [--btn-border:var(--color-orange-600)]/90",
                "[--btn-icon:var(--color-orange-300)] data-pressed:[--btn-icon:var(--color-orange-200)] data-hovered:[--btn-icon:var(--color-orange-200)]",
            ],
            amber: [
                "text-amber-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-amber-400)] [--btn-border:var(--color-amber-500)]/80",
                "[--btn-icon:var(--color-amber-600)]",
            ],
            yellow: [
                "text-yellow-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-yellow-300)] [--btn-border:var(--color-yellow-400)]/80",
                "[--btn-icon:var(--color-yellow-600)] data-pressed:[--btn-icon:var(--color-yellow-700)] data-hovered:[--btn-icon:var(--color-yellow-700)]",
            ],
            lime: [
                "text-lime-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-lime-300)] [--btn-border:var(--color-lime-400)]/80",
                "[--btn-icon:var(--color-lime-600)] data-pressed:[--btn-icon:var(--color-lime-700)] data-hovered:[--btn-icon:var(--color-lime-700)]",
            ],
            green: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90",
                "[--btn-icon:var(--color-white)]/60 data-pressed:[--btn-icon:var(--color-white)]/80 data-hovered:[--btn-icon:var(--color-white)]/80",
            ],
            emerald: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-emerald-600)] [--btn-border:var(--color-emerald-700)]/90",
                "[--btn-icon:var(--color-white)]/60 data-pressed:[--btn-icon:var(--color-white)]/80 data-hovered:[--btn-icon:var(--color-white)]/80",
            ],
            teal: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-teal-600)] [--btn-border:var(--color-teal-700)]/90",
                "[--btn-icon:var(--color-white)]/60 data-pressed:[--btn-icon:var(--color-white)]/80 data-hovered:[--btn-icon:var(--color-white)]/80",
            ],
            sky: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-sky-500)] [--btn-border:var(--color-sky-600)]/80",
                "[--btn-icon:var(--color-white)]/60 data-pressed:[--btn-icon:var(--color-white)]/80 data-hovered:[--btn-icon:var(--color-white)]/80",
            ],
            blue: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-blue-600)] [--btn-border:var(--color-blue-700)]/90",
                "[--btn-icon:var(--color-blue-400)] data-pressed:[--btn-icon:var(--color-blue-300)] data-hovered:[--btn-icon:var(--color-blue-300)]",
            ],
            violet: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-violet-500)] [--btn-border:var(--color-violet-600)]/90",
                "[--btn-icon:var(--color-violet-300)] data-pressed:[--btn-icon:var(--color-violet-200)] data-hovered:[--btn-icon:var(--color-violet-200)]",
            ],
            purple: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-purple-500)] [--btn-border:var(--color-purple-600)]/90",
                "[--btn-icon:var(--color-purple-300)] data-pressed:[--btn-icon:var(--color-purple-200)] data-hovered:[--btn-icon:var(--color-purple-200)]",
            ],
            fuchsia: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-fuchsia-500)] [--btn-border:var(--color-fuchsia-600)]/90",
                "[--btn-icon:var(--color-fuchsia-300)] data-pressed:[--btn-icon:var(--color-fuchsia-200)] data-hovered:[--btn-icon:var(--color-fuchsia-200)]",
            ],
            pink: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-pink-500)] [--btn-border:var(--color-pink-600)]/90",
                "[--btn-icon:var(--color-pink-300)] data-pressed:[--btn-icon:var(--color-pink-200)] data-hovered:[--btn-icon:var(--color-pink-200)]",
            ],
            rose: [
                "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-rose-500)] [--btn-border:var(--color-rose-600)]/90",
                "[--btn-icon:var(--color-rose-300)] data-pressed:[--btn-icon:var(--color-rose-200)] data-hovered:[--btn-icon:var(--color-rose-200)]",
            ],
        },
    },
});

// Soft-variant accent: maps each `color` to the `--btn-soft` accent the `soft` variant reads from
// (lighter 500 shade in light mode, 400 in dark, matching the original blue soft button). Greyscale
// solid colors collapse to zinc since a "soft white" tint is meaningless. Mirrors `buttonColor`'s
// key set so `color` stays a single shared type across solid and soft.
let buttonSoftColor = cva({
    variants: {
        color: {
            "dark/zinc":
                "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            light: "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            "dark/white":
                "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            dark: "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            white: "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            zinc: "[--btn-soft:var(--color-zinc-500)] dark:[--btn-soft:var(--color-zinc-400)]",
            indigo: "[--btn-soft:var(--color-indigo-500)] dark:[--btn-soft:var(--color-indigo-400)]",
            cyan: "[--btn-soft:var(--color-cyan-500)] dark:[--btn-soft:var(--color-cyan-400)]",
            red: "[--btn-soft:var(--color-red-500)] dark:[--btn-soft:var(--color-red-400)]",
            orange: "[--btn-soft:var(--color-orange-500)] dark:[--btn-soft:var(--color-orange-400)]",
            amber: "[--btn-soft:var(--color-amber-500)] dark:[--btn-soft:var(--color-amber-400)]",
            yellow: "[--btn-soft:var(--color-yellow-500)] dark:[--btn-soft:var(--color-yellow-400)]",
            lime: "[--btn-soft:var(--color-lime-500)] dark:[--btn-soft:var(--color-lime-400)]",
            green: "[--btn-soft:var(--color-green-500)] dark:[--btn-soft:var(--color-green-400)]",
            emerald:
                "[--btn-soft:var(--color-emerald-500)] dark:[--btn-soft:var(--color-emerald-400)]",
            teal: "[--btn-soft:var(--color-teal-500)] dark:[--btn-soft:var(--color-teal-400)]",
            sky: "[--btn-soft:var(--color-sky-500)] dark:[--btn-soft:var(--color-sky-400)]",
            blue: "[--btn-soft:var(--color-blue-500)] dark:[--btn-soft:var(--color-blue-400)]",
            violet: "[--btn-soft:var(--color-violet-500)] dark:[--btn-soft:var(--color-violet-400)]",
            purple: "[--btn-soft:var(--color-purple-500)] dark:[--btn-soft:var(--color-purple-400)]",
            fuchsia:
                "[--btn-soft:var(--color-fuchsia-500)] dark:[--btn-soft:var(--color-fuchsia-400)]",
            pink: "[--btn-soft:var(--color-pink-500)] dark:[--btn-soft:var(--color-pink-400)]",
            rose: "[--btn-soft:var(--color-rose-500)] dark:[--btn-soft:var(--color-rose-400)]",
        },
    },
});

type ButtonColor = NonNullable<VariantProps<typeof buttonColor>["color"]>;

type ButtonProps = (
    | { color?: ButtonColor; outline?: never; plain?: never; soft?: never }
    | { color?: never; outline: true; plain?: never; soft?: never }
    | { color?: never; outline?: never; plain: true; soft?: never }
    | { color?: ButtonColor; outline?: never; plain?: never; soft: true }
) & { className?: string; children: React.ReactNode; ref?: React.Ref<HTMLButtonElement> } & (
        | Omit<React.ComponentPropsWithoutRef<typeof RACButton>, "className">
        | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    );

export function Button({
    ref,
    color,
    outline,
    plain,
    soft,
    className,
    children,
    ...props
}: ButtonProps) {
    let variant: "solid" | "outline" | "plain" | "soft" = outline
        ? "outline"
        : plain
          ? "plain"
          : soft
            ? "soft"
            : "solid";
    let classes = cx(
        buttonBase({ variant }),
        variant === "solid" && buttonColor({ color: color ?? "dark/zinc" }),
        variant === "soft" && buttonSoftColor({ color: color ?? "blue" }),
        className,
    );

    // An `href` (even a present-but-`undefined` one stays out via the `!= null` check) always renders
    // an anchor — including when disabled. RAC's `Link` would swap a disabled link to a <span>;
    // instead we keep the <a> and disable it with CSS/ARIA: `data-disabled` drives the same dimmed/
    // desaturated styling buttons get, while `pointer-events-none` + `tabIndex={-1}` + `aria-disabled`
    // make it non-interactive. Only hrefless controls fall back to a real <button>. `href`/`isDisabled`
    // are pulled out of the spread so neither leaks onto the wrong element; the cast collapses the
    // button|anchor prop union at this polymorphic boundary (cf. dropdown.tsx) while the public
    // `ButtonProps` keeps call sites type-checked.
    let { href, isDisabled, ...rest } = props as unknown as {
        href?: string;
        isDisabled?: boolean;
    };

    return href != null ? (
        <Link
            {...rest}
            aria-disabled={isDisabled || undefined}
            className={cx(classes, isDisabled && "pointer-events-none")}
            data-disabled={isDisabled ? "" : undefined}
            href={href}
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            tabIndex={isDisabled ? -1 : undefined}
        >
            <TouchTarget>{children}</TouchTarget>
        </Link>
    ) : (
        <RACButton
            {...rest}
            className={cx(classes, "cursor-default")}
            isDisabled={isDisabled}
            ref={ref}
        >
            <TouchTarget>{children}</TouchTarget>
        </RACButton>
    );
}

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
    return (
        <>
            <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
            />
            {children}
        </>
    );
}
