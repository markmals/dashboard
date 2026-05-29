import { Button as RACButton } from "react-aria-components";
import clsx from "clsx";
import type React from "react";
import { TouchTarget } from "./button.tsx";
import { Link } from "./link.tsx";

interface AvatarProps {
    src?: string | null;
    square?: boolean;
    initials?: string;
    alt?: string;
    className?: string;
}

export function Avatar({
    src = null,
    square = false,
    initials,
    alt = "",
    className,
    ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            data-slot="avatar"
            {...props}
            className={clsx(
                className,
                // Basic layout
                "inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1",
                "outline-1 -outline-offset-1 outline-black/(--ring-opacity) outline-solid dark:outline-white/(--ring-opacity)",
                // Add the correct border radius
                square
                    ? "rounded-(--avatar-radius) *:rounded-(--avatar-radius)"
                    : "rounded-full *:rounded-full",
            )}
        >
            {initials && (
                <svg
                    aria-hidden={alt ? undefined : "true"}
                    className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
                    viewBox="0 0 100 100"
                >
                    {alt && <title>{alt}</title>}
                    <text
                        alignmentBaseline="middle"
                        dominantBaseline="middle"
                        dy=".125em"
                        textAnchor="middle"
                        x="50%"
                        y="50%"
                    >
                        {initials}
                    </text>
                </svg>
            )}
            {src && <img alt={alt} className="size-full" src={src} />}
        </span>
    );
}

export const AvatarButton = function AvatarButton({
    ref,
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
}) {
    const classes = clsx(
        className,
        square ? "rounded-[20%]" : "rounded-full",
        "relative inline-grid focus:outline-hidden data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-blue-500 data-focus-visible:outline-solid",
    );

    return "href" in props ? (
        <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
            <TouchTarget>
                <Avatar alt={alt} initials={initials} square={square} src={src} />
            </TouchTarget>
        </Link>
    ) : (
        <RACButton {...props} className={classes} ref={ref}>
            <TouchTarget>
                <Avatar alt={alt} initials={initials} square={square} src={src} />
            </TouchTarget>
        </RACButton>
    );
};
