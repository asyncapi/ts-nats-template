export declare class GeneralReply {
    private _statusCode?;
    private _statusMessage?;
    private _additionalProperties?;
    constructor(input: {
        statusCode?: number;
        statusMessage?: string;
    });
    statusCode: number | undefined;
    statusMessage: string | undefined;
    additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined;
    marshal(): string;
    static unmarshal(json: string | object): GeneralReply;
}
