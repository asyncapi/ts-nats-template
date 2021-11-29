export declare class AnonymousSchema_1 {
    private _lumen;
    private _additionalProperties?;
    constructor(input: {
        lumen: number;
    });
    get lumen(): number;
    set lumen(lumen: number);
    get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null> | undefined;
    set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined);
    marshal(): string;
    static unmarshal(json: string | object): AnonymousSchema_1;
}
