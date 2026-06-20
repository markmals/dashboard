import {
    createTemporaryReferenceSet,
    decodeAction,
    decodeFormState,
    decodeReply,
    loadServerAction,
    renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import {
    RouterContextProvider,
    unstable_matchRSCServerRequest as matchRSCServerRequest,
} from "react-router";
// @ts-expect-error - no types for this virtual module
import basename from "virtual:react-router/unstable_rsc/basename";
// @ts-expect-error - no types for this virtual module
import routeDiscovery from "virtual:react-router/unstable_rsc/route-discovery";
// @ts-expect-error - no types for this virtual module
import routes from "virtual:react-router/unstable_rsc/routes";

// Ambient type for the `import.meta.viteRsc.loadModule` helper injected by @vitejs/plugin-rsc.
// The plugin provides it at runtime but does not ship a global type augmentation.
declare global {
    interface ImportMeta {
        readonly viteRsc: {
            loadModule<T = unknown>(environmentName: string, entryName: string): Promise<T>;
        };
    }
}

interface ReactRouterSSRModule {
    generateHTML(request: Request, serverResponse: Response): Promise<Response>;
}

export function fetchServer(request: Request, requestContext?: RouterContextProvider) {
    return matchRSCServerRequest({
        basename,
        createTemporaryReferenceSet,
        decodeAction,
        decodeFormState,
        decodeReply,
        loadServerAction,
        request,
        requestContext,
        routes,
        routeDiscovery,
        generateResponse(match, options) {
            return new Response(renderToReadableStream(match.payload, options), {
                status: match.statusCode,
                headers: match.headers,
            });
        },
    });
}

export default {
    async fetch(request) {
        let ssr = await import.meta.viteRsc.loadModule<ReactRouterSSRModule>("ssr", "index");
        return await ssr.generateHTML(request, await fetchServer(request));
    },
} satisfies ExportedHandler<Env>;

if (import.meta.hot) {
    import.meta.hot.accept();
}
