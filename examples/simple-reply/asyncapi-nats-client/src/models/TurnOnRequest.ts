
class TurnOnRequest {
  private _lumen: number;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    lumen: number,
    additionalProperties?: Map<string, any>,
  }) {
    this._lumen = input.lumen;
    this._additionalProperties = input.additionalProperties;
  }

  get lumen(): number { return this._lumen; }
  set lumen(lumen: number) { this._lumen = lumen; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.lumen !== undefined) {
      json += `"lumen": ${typeof this.lumen === 'number' || typeof this.lumen === 'boolean' ? this.lumen : JSON.stringify(this.lumen)},`; 
    }
    if(this.additionalProperties !== undefined) { 
    for (const [key, value] of this.additionalProperties.entries()) {
      //Only unwrap those who are not already a property in the JSON object
      if(Object.keys(this).includes(String(key))) continue;
        json += `"${key}": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;
      }
    }

    //Remove potential last comma 
    return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
  }

  public static unmarshal(json: string | object): TurnOnRequest {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new TurnOnRequest({} as any);

    if (obj["lumen"] !== undefined) {
      instance.lumen = obj["lumen"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["lumen","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export default TurnOnRequest;
