import { Button, Divider, Heading } from "@tailwindcss/catalyst"

export function SectionHeader({ children, className }: { children: string; className?: string }) {
    return (
        <div className={className}>
            <Heading className="mb-4">{children}</Heading>
            <Divider />
        </div>
    )
}
