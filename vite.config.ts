import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
    plugins: [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        reactRouter(),
        babel({
            filter: /\.[jt]sx?$/,
            babelConfig: {
                presets: ["@babel/preset-typescript"],
                plugins: [["babel-plugin-react-compiler", {}]],
            },
        }),
        tailwindcss(),
    ],
    experimental: {
        enableNativePlugin: true,
    },
    resolve: {
        tsconfigPaths: true,
    },
});
