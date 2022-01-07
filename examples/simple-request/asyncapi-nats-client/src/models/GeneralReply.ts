

class GeneralReply {
  private _statusCode?: number;
  private _statusMessage?: string;
  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null>;

  constructor(input: {
    statusCode?: number,
    statusMessage?: string,
  }) {
    this._statusCode = input.statusCode;
    this._statusMessage = input.statusMessage;
  }

  get statusCode(): number | undefined { return this._statusCode; }
  set statusCode(statusCode: number | undefined) { this._statusCode = statusCode; }

  get statusMessage(): string | undefined { return this._statusMessage; }
  set statusMessage(statusMessage: string | undefined) { this._statusMessage = statusMessage; }

  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.statusCode !== undefined) {
      json += `"status_code": ${typeof this.statusCode === 'number' || typeof this.statusCode === 'boolean' ? this.statusCode : JSON.stringify(this.statusCode)},`; 
    }
    if(this.statusMessage !== undefined) {
      json += `"status_message": ${typeof this.statusMessage === 'number' || typeof this.statusMessage === 'boolean' ? this.statusMessage : JSON.stringify(this.statusMessage)},`; 
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

  public static unmarshal(json: string | object): GeneralReply {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new GeneralReply({} as any);

    if (obj["status_code"] !== undefined) {
      instance.statusCode = obj["status_code"];
    }
    if (obj["status_message"] !== undefined) {
      instance.statusMessage = obj["status_message"];
    }

    //Not part of core properties
  
    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["status_code","status_message"].includes(key);}))) {
    
      instance.additionalProperties.set(key, value as any);
    }
    return instance;
  }
}
export default GeneralReply;
