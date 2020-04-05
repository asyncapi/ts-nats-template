

    
import { default as ResponseSchema } from '../schema/Response';


export default class DimLightResponse {
  
    
  response:ResponseSchema;


  constructor(
    response: ResponseSchema
  ){
  
    
    this.response = response;

  }

  /**
   * Parses a JSON string to an object of DimLightResponse message class.
   * @param json string to be parsed as DimLightResponse.
   */
  public static toMessage(json: string): DimLightResponse {
    return JSON.parse(json);
  }

}
