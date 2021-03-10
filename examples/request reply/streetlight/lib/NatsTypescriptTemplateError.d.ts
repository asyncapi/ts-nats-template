export declare enum ErrorCode {
    NOT_CONNECTED = "NOT_CONNECTED",
    INTERNAL_NATS_TS_ERROR = "INTERNAL_NATS_TS_ERROR",
    HOOK_ERROR = "HOOK_ERROR"
}
/** @internal **/
export declare class Messages {
    static messages: Messages;
    messages: {
        [key: string]: string;
    };
    private constructor();
    static getMessage(s: string): string;
    getMessage(s: string): string;
}
export declare class NatsTypescriptTemplateError implements Error {
    name: string;
    message: string;
    code: string;
    chainedError?: Error;
    /**
     * @param {String} message
     * @param {String} code
     * @param {Error} [chainedError]
     * @constructor
     *
     * @api private
     * @internal
     */
    constructor(message: string, code: string, chainedError?: Error);
    /**
     * @param code
     * @param chainedError
     * @api private
     * @internal
     */
    static errorForCode(code: string, chainedError?: Error): NatsTypescriptTemplateError;
}
