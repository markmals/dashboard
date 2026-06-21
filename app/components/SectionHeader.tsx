import type { PropsWithChildren, ReactNode } from "react";

import { Divider, Heading } from "@tailwindcss/ui/index.ts";

// `actions` renders inline on the right of the title (e.g. the sort/filter controls). The row is a
// flex-wrap container so the controls can sit beside the heading on desktop yet drop to their own
// full-width line below it on mobile.
export function SectionHeader({
    actions,
    children,
    className,
}: { actions?: ReactNode; className?: string } & PropsWithChildren) {
    return (
        <div className={className}>
            <div className="mb-4 flex flex-wrap items-center gap-x-4">
                <Heading className="min-w-0 flex-1 truncate">{children}</Heading>
                {actions}
            </div>
            <Divider />
        </div>
    );
}
