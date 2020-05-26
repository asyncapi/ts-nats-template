
  
import { 
  Client, 
  NatsConnectionOptions, 
  connect,
  Payload, 
  NatsError, 
  Subscription, 
  ServersChangedEvent, 
  SubEvent, 
  ServerInfo
  } from 'ts-nats';
import * as smartylightingStreetlights10EventChannel from "#testchannels/SmartylightingStreetlights10Event";
import * as smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel from "#testchannels/SmartylightingStreetlights10EventStreetlightIdLightingMeasured";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOnChannel from "#testchannels/SmartylightingStreetlights10ActionStreetlightIdTurnOn";
import * as smartylightingStreetlights10ActionStreetlightIdTurnOffChannel from "#testchannels/SmartylightingStreetlights10ActionStreetlightIdTurnOff";
import * as smartylightingStreetlights10ActionStreetlightIdDimChannel from "#testchannels/SmartylightingStreetlights10ActionStreetlightIdDim";
import {default as LightMeasuredMessage} from "#messages/LightMeasured";
import {default as TurnOnOffMessage} from "#messages/TurnOnOff";
import {default as TurnOnOffResponseMessage} from "#messages/TurnOnOffResponse";
import {default as DimLightMessage} from "#messages/DimLight";
import {default as DimLightResponseMessage} from "#messages/DimLightResponse";
import {fromSeed} from 'ts-nkeys';
import * as events from 'events';
export enum AvailableEvents {
	connectionError = 'connectionError',
  permissionError = 'permissionError',
  close = 'close',
  connect = 'connect',
  connecting = 'connecting',
  disconnect = 'disconnect',
  error = 'error',
  pingcount = 'pingcount',
  pingtimer = 'pingtimer',
  reconnect = 'reconnect',
  reconnecting = 'reconnecting',
  serversChanged = 'serversChanged',
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
  yield = 'yield'
}
export declare interface NatsAsyncApiTestClient {
  on(event: AvailableEvents.connectionError, listener: (error: any) => void): this;
  on(event: AvailableEvents.permissionError, listener: (error: NatsError) => void): this;
  on(event: AvailableEvents.close, listener: (error: NatsError) => void): this;
  on(event: AvailableEvents.connect, listener: (connection: Client, serverURL: string, info: ServerInfo) => void): this;
  on(event: AvailableEvents.connecting, listener: (error: NatsError) => void): this;
  on(event: AvailableEvents.disconnect, listener: (serverURL: string) => void): this;
  on(event: AvailableEvents.error, listener: (error: NatsError) => void): this;
  on(event: AvailableEvents.pingcount, listener: () => void): this;
  on(event: AvailableEvents.pingtimer, listener: () => void): this;
  on(event: AvailableEvents.reconnect, listener: (connection: Client, serverURL: string, info: ServerInfo)=> void): this;
  on(event: AvailableEvents.reconnecting, listener: (serverURL: string) => void): this;
  on(event: AvailableEvents.serversChanged, listener: (e: ServersChangedEvent) => void): this;
  on(event: AvailableEvents.subscribe, listener: (e: SubEvent) => void): this;
  on(event: AvailableEvents.unsubscribe, listener: (e: SubEvent) => void): this;
  on(event: AvailableEvents.yield, listener:  () => void): this;
}
export class NatsAsyncApiTestClient extends events.EventEmitter{
  public jsonClient?: Client;
  public stringClient?: Client;
  public binaryClient?: Client;
  public options?: NatsConnectionOptions;

	/**
	 *
	 * @param options options to use, payload is omitted if sat in the AsyncAPI document.
	 */
  constructor() {
    super();
  }

  /**
   * Try to connect to the NATS server with the different payloads.
   */
  async connect(options : NatsConnectionOptions){
		this.options = this.setDefaultOptions(options);
    try{
      this.options.payload = Payload.JSON;
      this.jsonClient = await connect(this.options);
      this.chainEvents(this.jsonClient);
    }catch(e){
      this.emit(AvailableEvents.connectionError, e)
    }
  }


  /**
   * Disconnect all clients from the server
   */
  async disconnect(){
    this.jsonClient!.close()
  }
  
  private chainEvents(ns: Client){
      ns.on('permissionError', (e: NatsError) => {
        this.emit(AvailableEvents.permissionError, e)
      });
      ns.on('close', (e: NatsError) => {
        this.emit(AvailableEvents.close, e)
      });
      ns.on('connect', (connection: Client, serverURL: string, info: ServerInfo) => {
        this.emit(AvailableEvents.connect, connection, serverURL, info)
      });
      ns.on('connecting', (serverURL: NatsError) => {
        this.emit(AvailableEvents.connecting, serverURL)
      });
      ns.on('disconnect', (serverURL: string) => {
        this.emit(AvailableEvents.disconnect, serverURL)
      });
      ns.on('error', (e: NatsError) => {
        this.emit(AvailableEvents.error, e)
      });
      ns.on('pingcount', () => {
        this.emit(AvailableEvents.pingcount)
      });
      ns.on('pingtimer', () => {
        this.emit(AvailableEvents.pingtimer)
      });
      ns.on('reconnect', (connection: Client, serverURL: string, info: ServerInfo) => {
        this.emit(AvailableEvents.reconnect, connection, serverURL, info)
      });
      ns.on('reconnecting', (serverURL: string) => {
        this.emit(AvailableEvents.reconnecting, serverURL)
      });
      ns.on('serversChanged', (e: ServersChangedEvent) => {
        this.emit(AvailableEvents.serversChanged, e)
      });
      ns.on('subscribe', (e: SubEvent) => {
        this.emit(AvailableEvents.subscribe, e)
      });
      ns.on('unsubscribe', (e: SubEvent) => {
        this.emit(AvailableEvents.unsubscribe, e)
      });
      ns.on('yield', () => {
        this.emit(AvailableEvents.yield)
      });
  }
  /**
   * Try to connect to the NATS server with nkey authentication
   */
  async connectWithNkey(options : NatsConnectionOptions, publicNkey: string, seed: string){
    options.nkey = publicNkey;
    options.nonceSigner = (nonce: string): Buffer => {
      const sk = fromSeed(Buffer.from(seed));
      return sk.sign(Buffer.from(nonce));
    }
    await this.connect(options);
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
  public subscribeToSmartylightingStreetlights10Event(onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage) => void ): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return smartylightingStreetlights10EventChannel.subscribe(onDataCallback, nc
      );
    }else{
      return Promise.reject(new Error('Nats client is not connected, could not send message on channel smartylightingStreetlights10Event'))
    }
  }

      
  /**
  *  Topic for which one can subscribe to measurements on a specific streetlightId.
  * @param onDataCallback Called when message recieved.
  */
  public subscribeToSmartylightingStreetlights10EventStreetlightIdLightingMeasured(onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage, streetlightId?: string) => void 
    ,streetlightId: string
  ): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel.subscribe(onDataCallback, nc
      
        ,streetlightId
      );
    }else{
      return Promise.reject(new Error('Nats client is not connected, could not send message on channel smartylightingStreetlights10EventStreetlightIdLightingMeasured'))
    }
  }

      
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOn(requestMessage: TurnOnOffMessage 
  
    ,streetlightId: string
  ): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return smartylightingStreetlights10ActionStreetlightIdTurnOnChannel.request(requestMessage, nc
      
        ,streetlightId
      );
    }else{
      return Promise.reject(new Error('Nats client is not connected, could not send message on channel smartylightingStreetlights10ActionStreetlightIdTurnOn'))
    }
  }

      
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOff(requestMessage: TurnOnOffMessage 
  
    ,streetlightId: string
  ): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return smartylightingStreetlights10ActionStreetlightIdTurnOffChannel.request(requestMessage, nc
      
        ,streetlightId
      );
    }else{
      return Promise.reject(new Error('Nats client is not connected, could not send message on channel smartylightingStreetlights10ActionStreetlightIdTurnOff'))
    }
  }

      
  /**
  *  
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdDim(requestMessage: DimLightMessage 
  
    ,streetlightId: string
  ): Promise<DimLightResponseMessage> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return smartylightingStreetlights10ActionStreetlightIdDimChannel.request(requestMessage, nc
      
        ,streetlightId
      );
    }else{
      return Promise.reject(new Error('Nats client is not connected, could not send message on channel smartylightingStreetlights10ActionStreetlightIdDim'))
    }
  }


}