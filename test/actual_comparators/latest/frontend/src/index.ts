

import { Client, NatsConnectionOptions, connect, Payload, NatsError, Subscription } from 'ts-nats';
import * as smartylightingStreetlights10EventChannel from "./channels/Smartylighting/streetlights/1/0/event/*";
import * as smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel from "./channels/Smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOnChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/turn/on";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOffChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/turn/off";
import * as smartylightingStreetlights10ActionStreetlightIdDimChannel from "./channels/Smartylighting/streetlights/1/0/action/{streetlightId}/dim";
import {default as LightMeasuredMessage} from "./messages/LightMeasured";
import {default as TurnOnOffMessage} from "./messages/TurnOnOff";
import {default as TurnOnOffResponseMessage} from "./messages/TurnOnOffResponse";
import {default as DimLightMessage} from "./messages/DimLight";
import {default as DimLightResponseMessage} from "./messages/DimLightResponse";

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
  *  Topic for which one can subscribe to all measurements regardless of id.
  * @param onDataCallback Called when message recieved.
  */
  public subscribeToSmartylightingStreetlights10Event(onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventChannel.subscribe(onDataCallback, nc);
  }

    
  /**
  *  Topic for which one can subscribe to measurements on a specific streetlightId.
  * @param onDataCallback Called when message recieved.
  */
  public subscribeToSmartylightingStreetlights10EventStreetlightIdLightingMeasured(onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel.subscribe(onDataCallback, nc);
  }

    
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOn(requestMessage: TurnOnOffMessage): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOnChannel.request(requestMessage, nc);
  }

    
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOff(requestMessage: TurnOnOffMessage): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOffChannel.request(requestMessage, nc);
  }

    
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdDim(requestMessage: DimLightMessage): Promise<DimLightResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdDimChannel.request(requestMessage, nc);
  }

}
