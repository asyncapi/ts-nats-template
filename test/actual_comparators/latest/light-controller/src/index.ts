

import { Client, NatsConnectionOptions, connect, Payload, NatsError, Subscription } from 'ts-nats';
import * as smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel from "./channels/Smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOnChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/turn/on";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOffChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/turn/off";
import * as smartylightingStreetlights10ActionStreetlightIdDimChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/dim";
import {default as LightMeasuredMessage} from "./messages/LightMeasured";
import {default as TurnOnOffResponseMessage} from "./messages/TurnOnOffResponse";
import {default as TurnOnOffMessage} from "./messages/TurnOnOff";
import {default as DimLightResponseMessage} from "./messages/DimLightResponse";
import {default as DimLightMessage} from "./messages/DimLight";

export default class NatsAsyncApiClient {
  public jsonClient?: Client;
  public stringClient?: Client;
  public binaryClient?: Client;
  public options: NatsConnectionOptions;

	/**
	 *
	 * @param options options to use, payload is omitted if sat in the AsyncAPI document.
	 */
  constructor(options : NatsConnectionOptions) {
		this.options = this.setDefaultOptions(options);
    this.connect();
  }

  /**
   * Try to connect to the NATS server with the different payloads.
   */
  private async connect(){
    try{
      this.options.payload = Payload.JSON;
      this.jsonClient = await connect(this.options);
    }catch(e){
      console.error("Could not connect to NATS: " + e)
    }
  }

  /**
   * Set the default options based on the AsyncAPI file.
   * @param options to set
   */
  private setDefaultOptions(options: NatsConnectionOptions){
    //If server binding options sat set the options
    options.encoding = 'utf8';
    return options;
  }
    
  /**
  *  Any measured values will be published through this method.
  * @param requestMessage The message to publish.
  */
  public publishToSmartylightingStreetlights10EventStreetlightIdLightingMeasured(requestMessage: LightMeasuredMessage): Promise<void> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel.publish(requestMessage, nc);
  }

    
  /**
  *  Get notified when a streetlight should be turned on. This should only be handled by 1 subscriber but ensured by request reply.
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdTurnOn(onRequest : (err?: NatsError, msg?: TurnOnOffMessage) => TurnOnOffResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOnChannel.reply(onRequest, onReplyError, nc);
  }

    
  /**
  *  Get notified when a streetlight should be turned off. This should only be handled by 1 subscriber but ensured by request reply.
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdTurnOff(onRequest : (err?: NatsError, msg?: TurnOnOffMessage) => TurnOnOffResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOffChannel.reply(onRequest, onReplyError, nc);
  }

    
  /**
  *  Get notified when a streetlight should be dimmed. This should only be handled by 1 subscriber but ensured by request reply.
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdDim(onRequest : (err?: NatsError, msg?: DimLightMessage) => DimLightResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdDimChannel.reply(onRequest, onReplyError, nc);
  }

}
