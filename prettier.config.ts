import type { Config } from "prettier";

export default {
    printWidth: 100,
    tabWidth: 4,
    arrowParens: "avoid",

    // MARK: Keeping these defaults
    // useTabs: false,
    // semi: true,
    // singleQuote: false,
    // trailingComma: "all",
    // proseWrap: "preserve",

    plugins: [
        "prettier-plugin-pkg",
        "prettier-plugin-sh",
        "prettier-plugin-tailwindcss",
        "prettier-plugin-toml",
    ],

    overrides: [
        {
            files: ["*.jsonc"],
            options: {
                trailingComma: "none",
            },
        },
    ],
} satisfies Config;
