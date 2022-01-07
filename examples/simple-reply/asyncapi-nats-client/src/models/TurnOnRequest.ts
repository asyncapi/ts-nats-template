

class TurnOnRequest {
  private _lumen: number;
  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null>;

  constructor(input: {
    lumen: number,
  }) {
    this._lumen = input.lumen;
  }

  get lumen(): number { return this._lumen; }
  set lumen(lumen: number) { this._lumen = lumen; }

  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.lumen !== undefined) {
      json += `"lumen": ${typeof this.lumen === 'number' || typeof this.lumen === 'boolean' ? this.lumen : JSON.stringify(this.lumen)},`; 
    }
  
    if(this.additionalProperties !== undefined) { 
      for (const [key, value] of this.additionalProperties.entries()) {
        //Only render additionalProperties which are not already a property
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

    //Not part of core properties
  
    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["lumen"].includes(key);}))) {
    
      instance.additionalProperties.set(key, value as any);
    }
    return instance;
  }
}
export default TurnOnRequest;
