import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import aspectRatio from "@tailwindcss/aspect-ratio"

export default {
    content: ["./app/**/*.tsx", "./app/styles/**/*.ts"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [aspectRatio],
} satisfies Config
