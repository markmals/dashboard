import babel from "vite-plugin-babel";

export interface LoggerEvent extends Event {
    kind:
        | "CompileSuccess"
        | "CompileError"
        | "CompileDiagnostic"
        | "CompileSkip"
        | "PipelineError"
        | "Timing";

    detail: {
        description: string;
        suggestions: string;
        loc: {
            start: { line: number; column: number };
            end: { line: number; column: number };
        };
    };
}

export interface ReactCompilerConfig {
    /** Controls the strategy for determining which functions the React Compiler will optimize. */
    compilationMode?: "infer" | "annotation" | "syntax" | "all";
    /** Configures the React version compatibility for the compiled output. */
    target?: "17" | "18" | "19";
    /** Determines whether compilation errors should fail the build or skip optimization. */
    panicThreshold?: "none" | "critical_errors" | "all_errors";
    /** Configures custom logging to track compiler behavior and debug issues. */
    logger?: {
        logEvent: (filename: string | null, event: LoggerEvent) => void;
    };
    /** Configures runtime feature flag gating for compiled functions. */
    gating?: {
        /** Module path to import the feature flag from */
        source: string;
        /** Name of the exported function to import */
        importSpecifierName: string;
    };
}

export function reactCompiler(config: ReactCompilerConfig = {}) {
    return babel({
        filter: /\.[jt]sx?$/,
        babelConfig: {
            presets: ["@babel/preset-typescript"],
            plugins: [["babel-plugin-react-compiler", config]],
        },
    });
}
