
import { default as LightMeasuredPayloadSchema } from '#schemas/LightMeasuredPayload';
export default class LightMeasured {
  
    
  lightMeasuredPayload:LightMeasuredPayloadSchema;


  constructor(
    lightMeasuredPayload: LightMeasuredPayloadSchema
  ){
  
    
    this.lightMeasuredPayload = lightMeasuredPayload;

  }

  /**
   * Parses a JSON string to an object of LightMeasured message class.
   * @param json any to be parsed as LightMeasured.
   */
  public static toMessage(json: any): LightMeasured {
    return JSON.parse(JSON.stringify(json));
  }

}
