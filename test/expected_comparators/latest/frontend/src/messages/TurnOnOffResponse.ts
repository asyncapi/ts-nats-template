
import { default as ResponseSchema } from '#schemas/Response';
export default class TurnOnOffResponse {
  
    
  response:ResponseSchema;


  constructor(
    response: ResponseSchema
  ){
  
    
    this.response = response;

  }

  /**
   * Parses a JSON string to an object of TurnOnOffResponse message class.
   * @param json any to be parsed as TurnOnOffResponse.
   */
  public static toMessage(json: any): TurnOnOffResponse {
    return JSON.parse(JSON.stringify(json));
  }

}
