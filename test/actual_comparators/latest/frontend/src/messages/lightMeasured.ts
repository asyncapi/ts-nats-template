

    
import { default as LightMeasuredPayloadSchema } from '../schema/LightMeasuredPayload';


export default class LightMeasured {
  
    
  lightMeasuredPayload:LightMeasuredPayloadSchema;


  constructor(
    lightMeasuredPayload: LightMeasuredPayloadSchema
  ){
  
    
    this.lightMeasuredPayload = lightMeasuredPayload;

  }

  /**
   * Parses a JSON string to an object of LightMeasured message class.
   * @param json string to be parsed as LightMeasured.
   */
  public static toMessage(json: string): LightMeasured {
    return JSON.parse(json);
  }

}
