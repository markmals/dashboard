import { cva } from "~/styles/cva.ts";

let divider = cva({
    base: "w-full border-t",
    variants: {
        soft: {
            true: "border-zinc-950/5 dark:border-white/5",
            false: "border-zinc-950/10 dark:border-white/10",
        },
    },
    defaultVariants: {
        soft: false,
    },
});

export function Divider({
    soft,
    className,
    ...props
}: { soft?: boolean } & React.ComponentPropsWithoutRef<"hr">) {
    return <hr {...props} className={divider({ soft, className })} />;
}
