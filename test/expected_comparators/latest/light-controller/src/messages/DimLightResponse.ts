
import { default as ResponseSchema } from '#schemas/Response';
export default class DimLightResponse {
  
    
  response:ResponseSchema;


  constructor(
    response: ResponseSchema
  ){
  
    
    this.response = response;

  }

  /**
   * Parses a JSON string to an object of DimLightResponse message class.
   * @param json any to be parsed as DimLightResponse.
   */
  public static toMessage(json: any): DimLightResponse {
    return JSON.parse(JSON.stringify(json));
  }

}
