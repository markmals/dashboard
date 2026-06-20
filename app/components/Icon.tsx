import primaries from "~/assets/primaries.svg?url";

import type { IconName } from "./icon-names.ts";

// Renders a Primaries icon from the sprite subset (see scripts/build-icons.ts). Symbols use
// `fill="currentColor"`, so color follows the surrounding text color (text-*). `data-slot="icon"`
// lets the Button/Sidebar components size it the same way they sized the old Heroicons.
export function Icon({
    name,
    size = 20,
    className,
}: {
    name: IconName;
    size?: number;
    className?: string;
}) {
    return (
        <svg aria-hidden="true" className={className} data-slot="icon" height={size} width={size}>
            <use href={`${primaries}#${name}`} />
        </svg>
    );
}
