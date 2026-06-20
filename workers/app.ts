import { createRequestHandler } from "react-router";

let requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
);

export default {
    fetch(request) {
        return requestHandler(request);
    },
} satisfies ExportedHandler<Env>;
