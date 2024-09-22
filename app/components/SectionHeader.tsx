import { Divider, Heading } from "@tailwindcss/ui"
import { PropsWithChildren } from "react"

export function SectionHeader({ children, className }: { className?: string } & PropsWithChildren) {
    return (
        <div className={className}>
            <Heading className="mb-4 truncate">{children}</Heading>
            <Divider />
        </div>
    )
}
