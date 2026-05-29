import clsx from "clsx";
import type React from "react";
import { Heading, Modal, ModalOverlay, Dialog as RACDialog } from "react-aria-components";
import { Text } from "./text.tsx";

const sizes = {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
};

export function Alert({
    open,
    onClose,
    size = "md",
    className,
    children,
    ...props
}: {
    open?: boolean;
    onClose: (value: false) => void;
    size?: keyof typeof sizes;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <ModalOverlay
            className={clsx(
                "fixed inset-0 z-50 w-screen overflow-y-auto bg-zinc-950/15 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50",
                "transition-opacity duration-100 ease-out data-entering:opacity-0 data-exiting:opacity-0",
            )}
            isDismissable
            isOpen={open}
            onOpenChange={isOpen => {
                if (!isOpen) onClose(false);
            }}
        >
            <div className="grid min-h-full grid-rows-[1fr_auto_1fr] justify-items-center p-8 sm:grid-rows-[1fr_auto_3fr] sm:p-4">
                <Modal
                    className={clsx(
                        className,
                        sizes[size],
                        "row-start-2 w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-zinc-950/10 sm:rounded-2xl sm:p-6 dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline-solid",
                        "outline-none transition-all duration-100 ease-out",
                        "data-entering:opacity-0 data-entering:scale-95",
                        "data-exiting:opacity-0",
                    )}
                >
                    <RACDialog {...props} className="outline-none">
                        {children}
                    </RACDialog>
                </Modal>
            </div>
        </ModalOverlay>
    );
}

export function AlertTitle({
    className,
    ...props
}: { className?: string } & React.ComponentPropsWithoutRef<typeof Heading>) {
    return (
        <Heading
            slot="title"
            {...props}
            className={clsx(
                className,
                "text-center text-base/6 font-semibold text-balance text-zinc-950 sm:text-left sm:text-sm/6 sm:text-wrap dark:text-white",
            )}
        />
    );
}

export function AlertDescription({
    className,
    ...props
}: { className?: string } & React.ComponentPropsWithoutRef<typeof Text>) {
    return (
        <Text {...props} className={clsx(className, "mt-2 text-center text-pretty sm:text-left")} />
    );
}

export function AlertBody({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div {...props} className={clsx(className, "mt-4")} />;
}

export function AlertActions({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                "mt-6 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:mt-4 sm:flex-row sm:*:w-auto",
            )}
        />
    );
}
