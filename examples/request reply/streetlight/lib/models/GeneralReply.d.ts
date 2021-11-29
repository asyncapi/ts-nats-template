export declare class GeneralReply {
    private _statusCode?;
    private _statusMessage?;
    private _additionalProperties?;
    constructor(input: {
        statusCode?: number;
        statusMessage?: string;
    });
    get statusCode(): number | undefined;
    set statusCode(statusCode: number | undefined);
    get statusMessage(): string | undefined;
    set statusMessage(statusMessage: string | undefined);
    get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null> | undefined;
    set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined);
    marshal(): string;
    static unmarshal(json: string | object): GeneralReply;
}
