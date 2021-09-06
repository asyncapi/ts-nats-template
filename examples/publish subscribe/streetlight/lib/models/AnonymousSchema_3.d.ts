export declare class AnonymousSchema_3 {
    private _lumen;
    private _additionalProperties?;
    constructor(input: {
        lumen: number;
    });
    lumen: number;
    additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined;
    marshal(): string;
    static unmarshal(json: string | object): AnonymousSchema_3;
}
