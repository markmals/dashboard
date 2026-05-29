import clsx from "clsx";
import type React from "react";
import { Label as RACLabel } from "react-aria-components";

export function Fieldset({
    className,
    disabled,
    ...props
}: { className?: string; disabled?: boolean } & Omit<React.ComponentPropsWithoutRef<"fieldset">, "className">) {
    return (
        <fieldset
            {...props}
            disabled={disabled}
            data-disabled={disabled ? "" : undefined}
            className={clsx(className, "*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6")}
        />
    );
}

export function Legend({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<"legend">, "className">) {
    return (
        <legend
            data-slot="legend"
            {...props}
            className={clsx(
                className,
                "text-base/6 font-semibold text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white",
            )}
        />
    );
}

export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div data-slot="control" {...props} className={clsx(className, "space-y-8")} />;
}

export function Field({
    className,
    disabled,
    ...props
}: { className?: string; disabled?: boolean } & Omit<React.ComponentPropsWithoutRef<"div">, "className">) {
    return (
        <div
            {...props}
            data-disabled={disabled ? "" : undefined}
            className={clsx(
                className,
                "[&>[data-slot=label]+[data-slot=control]]:mt-3",
                "[&>[data-slot=label]+[data-slot=description]]:mt-1",
                "[&>[data-slot=description]+[data-slot=control]]:mt-3",
                "[&>[data-slot=control]+[data-slot=description]]:mt-3",
                "[&>[data-slot=control]+[data-slot=error]]:mt-3",
                "*:data-[slot=label]:font-medium",
            )}
        />
    );
}

export function Label({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<typeof RACLabel>, "className">) {
    return (
        <RACLabel
            data-slot="label"
            {...props}
            className={clsx(
                className,
                "text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white",
            )}
        />
    );
}

export function Description({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<"p">, "className">) {
    return (
        <p
            data-slot="description"
            {...props}
            className={clsx(
                className,
                "text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400",
            )}
        />
    );
}

export function ErrorMessage({
    className,
    ...props
}: { className?: string } & Omit<React.ComponentPropsWithoutRef<"p">, "className">) {
    return (
        <p
            data-slot="error"
            {...props}
            className={clsx(
                className,
                "text-base/6 text-red-600 data-disabled:opacity-50 sm:text-sm/6 dark:text-red-500",
            )}
        />
    );
}
