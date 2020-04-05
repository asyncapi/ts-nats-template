

    
import { default as TurnOnOffPayloadSchema } from '../schema/TurnOnOffPayload';


export default class TurnOnOff {
  
    
  turnOnOffPayload:TurnOnOffPayloadSchema;


  constructor(
    turnOnOffPayload: TurnOnOffPayloadSchema
  ){
  
    
    this.turnOnOffPayload = turnOnOffPayload;

  }

  /**
   * Parses a JSON string to an object of TurnOnOff message class.
   * @param json string to be parsed as TurnOnOff.
   */
  public static toMessage(json: string): TurnOnOff {
    return JSON.parse(json);
  }

}
