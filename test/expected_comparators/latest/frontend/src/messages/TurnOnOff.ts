
import { default as TurnOnOffPayloadSchema } from '#schemas/TurnOnOffPayload';
export default class TurnOnOff {
  
    
  turnOnOffPayload:TurnOnOffPayloadSchema;


  constructor(
    turnOnOffPayload: TurnOnOffPayloadSchema
  ){
  
    
    this.turnOnOffPayload = turnOnOffPayload;

  }

  /**
   * Parses a JSON string to an object of TurnOnOff message class.
   * @param json any to be parsed as TurnOnOff.
   */
  public static toMessage(json: any): TurnOnOff {
    return JSON.parse(JSON.stringify(json));
  }

}
