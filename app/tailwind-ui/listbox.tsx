"use client";

import clsx from "clsx";
import {
    Button as RACButton,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectValue,
} from "react-aria-components";

export function Listbox({
    className,
    placeholder,
    autoFocus,
    "aria-label": ariaLabel,
    children: options,
    ...props
}: {
    className?: string;
    placeholder?: React.ReactNode;
    autoFocus?: boolean;
    "aria-label"?: string;
    children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof Select>, "children" | "className">) {
    return (
        <Select aria-label={ariaLabel} {...props}>
            <RACButton
                autoFocus={autoFocus}
                className={clsx([
                    className,
                    // Basic layout
                    "group relative block w-full",
                    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                    "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",
                    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                    "dark:before:hidden",
                    // Hide default focus styles
                    "focus:outline-hidden",
                    // Focus ring
                    "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset data-focused:after:ring-2 data-focused:after:ring-blue-500",
                    // Disabled state
                    "data-disabled:opacity-50 data-disabled:before:bg-zinc-950/5 data-disabled:before:shadow-none",
                ])}
                data-slot="control"
            >
                <SelectValue
                    className={clsx([
                        // Basic layout
                        "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
                        // Set minimum height for when no value is selected
                        "min-h-11 sm:min-h-9",
                        // Horizontal padding
                        "pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
                        // Typography
                        "text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
                        // Border
                        "border border-zinc-950/10 group-data-pressed:border-zinc-950/20 group-data-hovered:border-zinc-950/20 dark:border-white/10 dark:group-data-pressed:border-white/20 dark:group-data-hovered:border-white/20",
                        // Background color
                        "bg-transparent dark:bg-white/5",
                        // Invalid state
                        "group-data-invalid:border-red-500 group-data-hovered:group-data-invalid:border-red-500 dark:group-data-invalid:border-red-600 dark:data-hovered:group-data-invalid:border-red-600",
                        // Disabled state
                        "group-data-disabled:border-zinc-950/20 group-data-disabled:opacity-100 dark:group-data-disabled:border-white/15 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:data-hovered:border-white/15",
                    ])}
                >
                    {({ isPlaceholder }) =>
                        isPlaceholder && placeholder ? (
                            <span className="block truncate text-zinc-500">{placeholder}</span>
                        ) : undefined
                    }
                </SelectValue>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                        aria-hidden="true"
                        className="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
                        fill="none"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M5.75 10.75L8 13L10.25 10.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                        />
                        <path
                            d="M10.25 5.25L8 3L5.75 5.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                        />
                    </svg>
                </span>
            </RACButton>
            <Popover
                className={clsx(
                    // Transition
                    "transition-opacity duration-100 ease-in data-exiting:opacity-0",
                    // Anchor positioning
                    "[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]",
                    // Base styles
                    "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-xl p-1 select-none",
                    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                    "outline-1 outline-transparent outline-solid focus:outline-hidden",
                    // Handle scrolling when menu won't fit in viewport
                    "overflow-y-scroll overscroll-contain",
                    // Popover background
                    "bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75",
                    // Shadows
                    "shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset",
                )}
            >
                <ListBox className="outline-none">
                    {options}
                </ListBox>
            </Popover>
        </Select>
    );
}

export function ListboxOption({
    children,
    className,
    ...props
}: { className?: string; children?: React.ReactNode } & Omit<
    React.ComponentPropsWithoutRef<typeof ListBoxItem>,
    "className" | "children"
>) {
    const sharedClasses = clsx(
        // Base
        "flex min-w-0 items-center",
        // Icons
        "*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4",
        "*:data-[slot=icon]:text-zinc-500 group-data-focused/option:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400",
        "forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-focused/option:*:data-[slot=icon]:text-[Canvas]",
        // Avatars
        "*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5",
    );

    return (
        <ListBoxItem
            {...props}
            textValue={typeof children === "string" ? children : undefined}
            className={clsx(
                // Basic layout
                "group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5",
                // Typography
                "text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
                // Focus
                "outline-hidden data-focused:bg-blue-500 data-focused:text-white",
                // Forced colors mode
                "forced-color-adjust-none forced-colors:data-focused:bg-[Highlight] forced-colors:data-focused:text-[HighlightText]",
                // Disabled
                "data-disabled:opacity-50",
            )}
        >
            {({ isSelected }) => (
                <>
                    <svg
                        aria-hidden="true"
                        className={clsx(
                            "relative size-5 self-center stroke-current sm:size-4",
                            isSelected ? "inline" : "hidden",
                        )}
                        fill="none"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M4 8.5l3 3L12 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                        />
                    </svg>
                    <span className={clsx(className, sharedClasses, "col-start-2")}>
                        {children}
                    </span>
                </>
            )}
        </ListBoxItem>
    );
}

export function ListboxLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={clsx(className, "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0")}
        />
    );
}

export function ListboxDescription({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={clsx(
                className,
                "flex flex-1 overflow-hidden text-zinc-500 group-data-focused/option:text-white before:w-2 before:min-w-0 before:shrink dark:text-zinc-400",
            )}
        >
            <span className="flex-1 truncate">{children}</span>
        </span>
    );
}
