import type { PropsWithChildren } from "react";

import { Divider, Heading } from "@tailwindcss/ui/index.ts";

export function SectionHeader({ children, className }: { className?: string } & PropsWithChildren) {
    return (
        <div className={className}>
            <Heading className="mb-4 truncate">{children}</Heading>
            <Divider />
        </div>
    );
}
