"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnonymousSchema_5 {
    constructor(input) {
        this._lumen = input.lumen;
    }
    get lumen() { return this._lumen; }
    set lumen(lumen) { this._lumen = lumen; }
    get additionalProperties() { return this._additionalProperties; }
    set additionalProperties(additionalProperties) { this._additionalProperties = additionalProperties; }
    marshal() {
        let json = '{';
        if (this.lumen !== undefined) {
            json += `"lumen": ${typeof this.lumen === 'number' || typeof this.lumen === 'boolean' ? this.lumen : JSON.stringify(this.lumen)},`;
        }
        if (this.additionalProperties !== undefined) {
            for (const [key, value] of this.additionalProperties.entries()) {
                //Only render additionalProperties which are not already a property
                if (Object.keys(this).includes(String(key)))
                    continue;
                json += `"${key}": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;
            }
        }
        //Remove potential last comma 
        return `${json.charAt(json.length - 1) === ',' ? json.slice(0, json.length - 1) : json}}`;
    }
    static unmarshal(json) {
        const obj = typeof json === "object" ? json : JSON.parse(json);
        const instance = new AnonymousSchema_5({});
        if (obj["lumen"] !== undefined) {
            instance.lumen = obj["lumen"];
        }
        //Not part of core properties
        if (instance.additionalProperties === undefined) {
            instance.additionalProperties = new Map();
        }
        for (const [key, value] of Object.entries(obj).filter((([key,]) => { return !["lumen"].includes(key); }))) {
            instance.additionalProperties.set(key, value);
        }
        return instance;
    }
}
exports.AnonymousSchema_5 = AnonymousSchema_5;
//# sourceMappingURL=AnonymousSchema_5.js.map