import { Divider, Heading } from "~/tailwind-ui"

export function SectionHeader({ children, className }: { children: string; className?: string }) {
    return (
        <div className={className}>
            <Heading className="mb-4 truncate">{children}</Heading>
            <Divider />
        </div>
    )
}
