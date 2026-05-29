"use client";

import clsx from "clsx";
import type React from "react";
import {
    Header,
    Menu,
    MenuItem as RACMenuItem,
    MenuSection as RACMenuSection,
    MenuTrigger,
    Popover,
    Separator,
} from "react-aria-components";
import { Button } from "./button.tsx";
import type { Link } from "./link.tsx";

export function Dropdown(props: React.ComponentPropsWithoutRef<typeof MenuTrigger>) {
    return <MenuTrigger {...props} />;
}

export function DropdownButton<T extends React.ElementType = typeof Button>({
    as: Component = Button as any,
    ...props
}: { as?: T; className?: string } & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">) {
    return <Component {...props} />;
}

export function DropdownMenu({
    anchor = "bottom",
    className,
    ...props
}: { anchor?: string; className?: string } & Omit<React.ComponentPropsWithoutRef<typeof Menu>, "className">) {
    return (
        <Popover
            placement={anchor === "bottom" ? "bottom start" : (anchor as any)}
            className={clsx(
                className,
                // Transition
                "transition-opacity duration-100 ease-in data-exiting:opacity-0",
                // Anchor positioning
                "[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(1)] data-[anchor~=end]:[--anchor-offset:6px] data-[anchor~=start]:[--anchor-offset:-6px] sm:data-[anchor~=end]:[--anchor-offset:4px] sm:data-[anchor~=start]:[--anchor-offset:-4px]",
                // Base styles
                "isolate w-max rounded-xl p-1",
                // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                "outline-1 outline-transparent outline-solid focus:outline-hidden",
                // Handle scrolling when menu won't fit in viewport
                "overflow-y-auto",
                // Popover background
                "bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75",
                // Shadows
                "shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset",
                // Define grid at the menu level if subgrid is supported
                "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
            )}
        >
            <Menu {...props} className="outline-none" />
        </Popover>
    );
}

export function DropdownItem({
    className,
    ...props
}: { className?: string } & (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    | Omit<React.ComponentPropsWithoutRef<"button">, "className">
)) {
    const classes = clsx(
        className,
        // Base styles
        "group cursor-default rounded-lg px-3.5 py-2.5 focus:outline-hidden sm:px-3 sm:py-1.5",
        // Text styles
        "text-left text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
        // Focus
        "data-focused:bg-blue-500 data-focused:text-white",
        // Disabled state
        "data-disabled:opacity-50",
        // Forced colors mode
        "forced-color-adjust-none forced-colors:data-focused:bg-[Highlight] forced-colors:data-focused:text-[HighlightText] forced-colors:data-focused:*:data-[slot=icon]:text-[HighlightText]",
        // Use subgrid when available but fallback to an explicit grid layout if not
        "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
        // Icons
        "*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4",
        "*:data-[slot=icon]:text-zinc-500 data-focused:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400 dark:data-focused:*:data-[slot=icon]:text-white",
        // Avatar
        "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5",
    );

    return "href" in props ? (
        <RACMenuItem {...(props as any)} className={classes} />
    ) : (
        <RACMenuItem {...props} className={classes} />
    );
}

export function DropdownHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div {...props} className={clsx(className, "col-span-5 px-3.5 pt-2.5 pb-1 sm:px-3")} />;
}

export function DropdownSection({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<typeof RACMenuSection>, "className">) {
    return (
        <RACMenuSection
            {...props}
            className={clsx(
                className,
                // Define grid at the section level instead of the item level if subgrid is supported
                "col-span-full supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
            )}
        />
    );
}

export function DropdownHeading({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<typeof Header>, "className">) {
    return (
        <Header
            {...props}
            className={clsx(
                className,
                "col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-zinc-500 sm:px-3 sm:text-xs/5 dark:text-zinc-400",
            )}
        />
    );
}

export function DropdownDivider({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<typeof Separator>, "className">) {
    return (
        <Separator
            {...props}
            className={clsx(
                className,
                "col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]",
            )}
        />
    );
}

export function DropdownLabel({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<"span">, "className">) {
    return (
        <span
            {...props}
            className={clsx(className, "col-start-2 row-start-1")}
            data-slot="label"
        />
    );
}

export function DropdownDescription({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<"span">, "className">) {
    return (
        <span
            data-slot="description"
            {...props}
            className={clsx(
                className,
                "col-span-2 col-start-2 row-start-2 text-sm/5 text-zinc-500 group-data-focused:text-white sm:text-xs/5 dark:text-zinc-400 forced-colors:group-data-focused:text-[HighlightText]",
            )}
        />
    );
}

export function DropdownShortcut({
    keys,
    className,
    ...props
}: { keys: string | string[]; className?: string } & Omit<
    React.ComponentPropsWithoutRef<"kbd">,
    "className"
>) {
    return (
        <kbd
            {...props}
            className={clsx(className, "col-start-5 row-start-1 flex justify-self-end")}
        >
            {(Array.isArray(keys) ? keys : keys.split("")).map((char, index) => (
                <kbd
                    className={clsx([
                        "min-w-[2ch] text-center font-sans text-zinc-400 capitalize group-data-focused:text-white forced-colors:group-data-focused:text-[HighlightText]",
                        // Make sure key names that are longer than one character (like "Tab") have extra space
                        index > 0 && char.length > 1 && "pl-1",
                    ])}
                    key={index}
                >
                    {char}
                </kbd>
            ))}
        </kbd>
    );
}
