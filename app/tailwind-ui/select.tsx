import { clsx } from "clsx";

export const Select = function Select({ ref, className, multiple, ...props }) {
    return (
        <span
            className={clsx([
                className,
                // Basic layout
                "group relative block w-full",
                // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",
                // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                "dark:before:hidden",
                // Focus ring
                "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-focus:after:ring-2 has-focus:after:ring-blue-500",
                // Disabled state
                "has-disabled:opacity-50 has-disabled:before:bg-zinc-950/5 has-disabled:before:shadow-none",
            ])}
            data-slot="control"
        >
            <select
                multiple={multiple}
                ref={ref}
                {...props}
                className={clsx([
                    // Basic layout
                    "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
                    // Horizontal padding
                    multiple
                        ? "px-[calc(--spacing(3.5)-1px)] sm:px-[calc(--spacing(3)-1px)]"
                        : "pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
                    // Options (multi-select)
                    "[&_optgroup]:font-semibold",
                    // Typography
                    "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white",
                    // Border
                    "border border-zinc-950/10 hover:border-zinc-950/20 dark:border-white/10 dark:hover:border-white/20",
                    // Background color
                    "bg-transparent dark:bg-white/5 dark:*:bg-zinc-800",
                    // Hide default focus styles
                    "focus:outline-hidden",
                    // Invalid state
                    "aria-invalid:border-red-500 aria-invalid:hover:border-red-500 dark:aria-invalid:border-red-600 dark:aria-invalid:hover:border-red-600",
                    // Disabled state
                    "disabled:border-zinc-950/20 disabled:opacity-100 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:hover:disabled:border-white/15",
                ])}
            />
            {!multiple && (
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                        aria-hidden="true"
                        className="size-5 stroke-zinc-500 group-has-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
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
            )}
        </span>
    );
};
