"use client";

import { Form, useSubmit } from "react-router";

import type { ControlOption } from "~/lib/collections.ts";

import { Button, Field, Label, Select } from "@tailwindcss/ui";

export interface CollectionControl {
    name: string;
    label: string;
    value: string;
    options: ControlOption[];
}

// A GET filter/sort toolbar. Each `<Select>` auto-submits the form on change (mirroring the
// contacts-rsc search pattern), driving everything through URL search params so the server
// component can read them via `getSearchParams()`. Empty selections are dropped to keep URLs clean.
export function CollectionControls({
    canReset,
    controls,
    resetTo,
}: {
    canReset: boolean;
    controls: CollectionControl[];
    resetTo: string;
}) {
    let submit = useSubmit();

    return (
        <Form
            aria-label="Sort and filter"
            className="flex flex-wrap items-end gap-4"
            method="get"
            onChange={event => {
                let params = new URLSearchParams();
                for (let [name, value] of new FormData(event.currentTarget)) {
                    if (typeof value === "string" && value) params.set(name, value);
                }
                submit(params, { method: "get", replace: true });
            }}
        >
            {controls.map(control => (
                <Field className="grow sm:w-48 sm:grow-0" key={control.name}>
                    <Label>{control.label}</Label>
                    {/* `key` on the value remounts the uncontrolled <select> so Reset and
                        browser back/forward navigations re-sync it to the URL. */}
                    <Select
                        aria-label={control.label}
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
                </Field>
            ))}
            {canReset && (
                <Button className="sm:ml-auto" href={resetTo} plain>
                    Reset
                </Button>
            )}
        </Form>
    );
}
