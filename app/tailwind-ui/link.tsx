import * as Headless from "@headlessui/react";
import React from "react";
import {
    Link as RemixLink,
    NavLink as RemixNavLink,
} from "react-router";

export const Link = function Link(
    { ref, ...props },
) {
    return (
        <Headless.DataInteractive>
            <RemixLink {...props} ref={ref} to={props.href} />
        </Headless.DataInteractive>
    );
};

export const NavLink = function Link(
    { ref, ...props },
) {
    return (
        <Headless.DataInteractive>
            <RemixNavLink {...props} ref={ref} to={props.href} />
        </Headless.DataInteractive>
    );
};
