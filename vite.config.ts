import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactCompiler } from "react-compiler.plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        reactRouter(),
        reactCompiler(),
        tailwindcss(),
    ],
    experimental: {
        enableNativePlugin: true,
    },
    resolve: {
        tsconfigPaths: true,
    },
});
