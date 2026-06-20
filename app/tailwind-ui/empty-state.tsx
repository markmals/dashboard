import type React from "react";

import { cx } from "~/styles/cva.ts";

export function EmptyState({ className, children }: React.ComponentPropsWithoutRef<"div">) {
    return <div className={cx(className, "text-center")}>{children}</div>;
}

export function EmptyStateIcon({ children }: { children: React.ReactNode }) {
    return <div className="mx-auto size-12 text-gray-400 dark:text-gray-500">{children}</div>;
}

export function EmptyStateHeading({ className, ...props }: React.ComponentPropsWithoutRef<"h2">) {
    return (
        <h2
            {...props}
            className={cx(className, "mt-2 text-base font-semibold text-gray-900 dark:text-white")}
        />
    );
}

export function EmptyStateDescription({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"p">) {
    return (
        <p {...props} className={cx(className, "mt-1 text-sm text-gray-500 dark:text-gray-400")} />
    );
}

export function EmptyStateActions({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div {...props} className={cx(className, "mt-6")} />;
}
