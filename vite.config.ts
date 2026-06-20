import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { unstable_reactRouterRSC as reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { contentLayer } from "@withsprinkles/content-layer/react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        // contentLayer must precede mdx: it emits the virtual `.mdx` modules that mdx compiles.
        contentLayer(),
        mdx(),
        reactRouter(),
        // The RSC plugin must come after the React Router RSC plugin.
        rsc(),
        babel({ presets: [reactCompilerPreset()] }),
        // Single Cloudflare Worker that runs the `rsc` environment; the `ssr` environment is
        // bundled in as a child and loaded in-process via import.meta.viteRsc.loadModule.
        cloudflare({
            viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        }),
        tailwindcss(),
    ],
    resolve: {
        tsconfigPaths: true,
    },
});
