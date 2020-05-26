
import { default as DimLightPayloadserereSchema } from '#schemas/DimLightPayloadserere';
import { default as ResponseSchema } from '#schemas/Response';
export default class DimLight {
  
    
    
  dimLightPayloadserere:DimLightPayloadserereSchema;

    
    
  response:ResponseSchema;


  constructor(
    
  ){
  
  }

  /**
   * Parses a JSON string to an object of DimLight message class.
   * @param json any to be parsed as DimLight.
   */
  public static toMessage(json: any): DimLight {
    return JSON.parse(JSON.stringify(json));
  }

}
