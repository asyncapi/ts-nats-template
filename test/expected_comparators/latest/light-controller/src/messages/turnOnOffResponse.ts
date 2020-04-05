

    
import { default as ResponseSchema } from '../schema/Response';


export default class TurnOnOffResponse {
  
    
  response:ResponseSchema;


  constructor(
    response: ResponseSchema
  ){
  
    
    this.response = response;

  }

  /**
   * Parses a JSON string to an object of TurnOnOffResponse message class.
   * @param json string to be parsed as TurnOnOffResponse.
   */
  public static toMessage(json: string): TurnOnOffResponse {
    return JSON.parse(json);
  }

}
