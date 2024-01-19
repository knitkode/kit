type ActionOutputTypes = {
    committed: "true" | "false";
    commit_sha: string | undefined;
    pushed: "true" | "false";
};
export declare class Git {
    baseDir: string;
    afterFetch: () => Promise<any>;
    outputs: ActionOutputTypes;
    errors: Error[];
    constructor(baseDir: string, afterFetch: () => Promise<any>);
    run(): Promise<void>;
    setOutput<T extends keyof ActionOutputTypes>(name: T, value: ActionOutputTypes[T]): void;
    logOutputs(): void;
    success(): void;
    error(e: Error): void;
}
export {};
