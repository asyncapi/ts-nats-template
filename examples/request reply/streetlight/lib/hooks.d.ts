export declare enum AvailableHooks {
    ReceivedData = "ReceivedData",
    BeforeSendingData = "BeforeSendingData"
}
export declare type ReceivedDataHook = (ReceivedData: any) => string;
export declare type BeforeSendingDataHook = (messageToSend: any) => string;
export declare class Hooks {
    private static instance;
    private hooks;
    private constructor();
    static getInstance(): Hooks;
    /**
     * Register a hook for BeforeSendingData
     * @param hook
     */
    registerBeforeSendingData(hook: BeforeSendingDataHook): Promise<void>;
    /**
     * Register a hook for BeforeSendingData
     * @param hook
     */
    registerReceivedData(hook: ReceivedDataHook): Promise<void>;
    /**
     * Returns all registered hooks for ReceivedData
     *
     * @returns {ReceivedDataHook[]} registered hooks
     */
    getReceivedDataHook(): ReceivedDataHook[];
    /**
     * Returns all registered hooks for BeforeSendingData
     *
     * @returns {BeforeSendingDataHook[]} registered hooks
     */
    getBeforeSendingDataHook(): BeforeSendingDataHook[];
}
