import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export let { cva, cx, compose } = defineConfig({
    hooks: { onComplete: className => twMerge(className) },
});
