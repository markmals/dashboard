"use client";

import { Button, Label, Select } from "@tailwindcss/ui";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { Form, useLocation, useSubmit } from "react-router";

import type { ControlOption } from "~/lib/collections.ts";

import { useMediaQuery } from "~/hooks/use-media-query.ts";

import { Icon } from "./Icon.tsx";

export interface CollectionControl {
    name: string;
    label: string;
    value: string;
    options: ControlOption[];
}

// Remembers whether the panel is open across remounts. A filter/sort change triggers a GET
// navigation that re-streams the RSC tree and remounts this client component, which would reset
// `useState`. A module-level memo survives that (it's `false` on the server and on the first client
// render, so there's no hydration mismatch — it only diverges after the user toggles).
let openMemo = false;

// The sort/filter cluster that lives inline on the right of a section header. Collapsed by default
// behind an icon toggle; expanding reveals a GET `<Form>` of `<Select>`s that auto-submit on change
// (driving everything through URL search params — the server reads them via `resolvePageParams`).
//
// Layout is responsive in two distinct ways, so the reveal animates a different axis per viewport:
//   • Wide (≥lg): the panel sits inline to the left of the toggle and expands its *width* (right→left)
//     while the heading truncates. Labels sit inline to the left of each select to keep the row one
//     line tall.
//   • Narrow (<lg): there isn't room beside the title for the (labeled) controls, so the panel drops
//     to a full-width row below the header (flex-wrap `basis-full`) and expands its *height*, with
//     labels stacked above each select.
//
// Returned as a fragment of two flex children (toggle + panel) so `SectionHeader`'s flex-wrap row
// owns the wrap. Persistence is server-side (the root middleware writes a cookie; in-app links bake
// the params back in via `restoredHref`). Reset is its own GET `<Form>` posting to the bare path,
// which the middleware reads as a clean reset.
export function CollectionControls({
    canReset,
    controls,
}: {
    canReset: boolean;
    controls: CollectionControl[];
}) {
    let submit = useSubmit();
    let { pathname } = useLocation();
    let [open, setOpen] = useState(openMemo);
    let panelId = useId();

    let isWide = useMediaQuery("(min-width: 1024px)");
    let reduce = useReducedMotion();

    function toggle() {
        setOpen(previous => {
            openMemo = !previous;
            return openMemo;
        });
    }

    // Expand width inline when wide, height (drop-down) when narrow. `auto` lets Framer Motion
    // measure the natural size in either axis.
    let collapsed = isWide ? { width: 0, opacity: 0 } : { height: 0, opacity: 0 };
    let expanded = isWide ? { width: "auto", opacity: 1 } : { height: "auto", opacity: 1 };

    return (
        <>
            <Button
                aria-controls={panelId}
                aria-expanded={open}
                aria-label={open ? "Hide sort and filter" : "Sort and filter"}
                className="relative shrink-0 lg:order-3"
                onPress={toggle}
                plain
            >
                <Icon name={open ? "close" : "sliders-vertical"} />
                {canReset && !open && (
                    <span
                        aria-hidden="true"
                        className="absolute top-1 right-1 size-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-900"
                    />
                )}
            </Button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        animate={expanded}
                        className="w-full basis-full overflow-hidden lg:order-2 lg:flex lg:w-auto lg:shrink-0 lg:basis-auto lg:justify-end"
                        exit={collapsed}
                        id={panelId}
                        initial={collapsed}
                        key="panel"
                        transition={
                            reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                        }
                    >
                        <div className="flex w-full flex-wrap items-end gap-3 pt-4 lg:w-max lg:flex-nowrap lg:items-center lg:pt-0">
                            <Form
                                aria-label="Sort and filter"
                                className="contents"
                                method="get"
                                onChange={event => {
                                    let params = new URLSearchParams();
                                    for (let [name, value] of new FormData(event.currentTarget)) {
                                        if (typeof value === "string" && value)
                                            params.set(name, value);
                                    }
                                    submit(params, { method: "get", replace: true });
                                }}
                            >
                                {controls.map(control => (
                                    <div
                                        className="flex min-w-32 flex-1 flex-col gap-1.5 lg:min-w-0 lg:flex-none lg:flex-row lg:items-center lg:gap-2"
                                        key={control.name}
                                    >
                                        <Label className="whitespace-nowrap lg:text-zinc-500 lg:dark:text-zinc-400">
                                            {control.label}
                                        </Label>
                                        {/* `key` on the value remounts the uncontrolled <select> so
                                            Reset and browser back/forward navigations re-sync it. */}
                                        <Select
                                            aria-label={control.label}
                                            className="lg:w-40"
                                            defaultValue={control.value}
                                            key={control.value}
                                            name={control.name}
                                        >
                                            {control.options.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                ))}
                            </Form>
                            {/* Reset is its own GET form posting to the bare path — the middleware
                                reads that as "forget this page's saved filters". A real submit
                                <button>, natively disabled when there's nothing to reset. */}
                            <Form action={pathname} className="contents" method="get">
                                <Button
                                    className="self-end lg:order-last lg:self-auto"
                                    color="dark/zinc"
                                    isDisabled={!canReset}
                                    type="submit"
                                >
                                    Reset
                                </Button>
                            </Form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
