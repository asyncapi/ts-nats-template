

import {fromSeed} from 'ts-nkeys';
import {ErrorCode, NatsTypescriptTemplateError} from '../../NatsTypescriptTemplateError';
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
import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
export {streetlightStreetlightIdCommandTurnonChannel};
import * as streetlightStreetlightIdEventTurnonChannel from "./testchannels/StreetlightStreetlightIdEventTurnon";
export {streetlightStreetlightIdEventTurnonChannel};
import * as SubscribeToTurnonCommandMessage from "../../messages/SubscribeToTurnonCommand";
export {SubscribeToTurnonCommandMessage};
import * as GeneralReplyMessage from "../../messages/GeneralReply";
export {GeneralReplyMessage};
import * as AnonymousMessage3Message from "../../messages/AnonymousMessage3";
export {AnonymousMessage3Message};



import * as events from 'events';
export enum AvailableEvents {
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
  on(event: AvailableEvents.permissionError, listener: (error: NatsTypescriptTemplateError) => void): this;
  on(event: AvailableEvents.close, listener: (error: NatsTypescriptTemplateError) => void): this;
  on(event: AvailableEvents.connect, listener: (connection: Client, serverURL: string, info: ServerInfo) => void): this;
  on(event: AvailableEvents.connecting, listener: (error: NatsTypescriptTemplateError) => void): this;
  on(event: AvailableEvents.disconnect, listener: (serverURL: string) => void): this;
  on(event: AvailableEvents.error, listener: (error: NatsTypescriptTemplateError) => void): this;
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
  connect(options : NatsConnectionOptions): Promise<void>{
    return new Promise(async (resolve: () => void, reject: (error: any) => void) => {
      this.options = this.setDefaultOptions(options);
      try{
        this.options.payload = Payload.JSON;
        this.jsonClient = await connect(this.options);
        this.chainEvents(this.jsonClient);
        resolve();
      }catch(e){
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }


  /**
   * Disconnect all clients from the server
   */
  async disconnect(){
    this.jsonClient!.close()
  }
  
  private chainEvents(ns: Client){
      ns.on('permissionError', (e: NatsError) => {
        this.emit(AvailableEvents.permissionError, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
      });
      ns.on('close', (e: NatsError) => {
        this.emit(AvailableEvents.close, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
      });
      ns.on('connect', (connection: Client, serverURL: string, info: ServerInfo) => {
        this.emit(AvailableEvents.connect, connection, serverURL, info)
      });
      ns.on('connecting', (serverURL: string) => {
        this.emit(AvailableEvents.connecting, serverURL)
      });
      ns.on('disconnect', (serverURL: string) => {
        this.emit(AvailableEvents.disconnect, serverURL)
      });
      ns.on('error', (e: NatsError) => {
        this.emit(AvailableEvents.error, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
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
   * Try to connect to the NATS server with user credentials
   */
  async connectWithUserCreds(userCreds: string, options?: NatsConnectionOptions){
    await this.connect({
      userCreds: userCreds,
      ... options
    });
  }
  /**
   * Try to connect to the NATS server with user and password
   */
  async connectWithUserPass(user: string, pass: string, options?: NatsConnectionOptions){
    await this.connect({
      user: user,
      pass: pass,
      ... options
    });
  }
  
  /**
   * Try to connect to the NATS server which has no authentication
   */
  async connectToHost(host: string, options?: NatsConnectionOptions){
    await this.connect({
      servers: [host],
      ... options
    });
  }

  /**
   * Try to connect to the NATS server with nkey authentication
   */
  async connectWithNkey(publicNkey: string, seed: string, options?: NatsConnectionOptions){
    await this.connect({
      nkey: publicNkey,
      nonceSigner: (nonce: string): Buffer => {
        const sk = fromSeed(Buffer.from(seed));
        return sk.sign(Buffer.from(nonce));
      },
      ... options
    });
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
  *  Channel for the turn on command which should turn on the streetlight
  * @param requestMessage The request message to send.
  */
  public requestStreetlightStreetlightIdCommandTurnon(requestMessage:GeneralReplyMessage.GeneralReply 
  
    ,streetlight_id: string
  ): Promise<SubscribeToTurnonCommandMessage.SubscribeToTurnonCommand> {
    const nc: Client = this.jsonClient!;
    if(nc){
      return streetlightStreetlightIdCommandTurnonChannel.request(requestMessage, nc
      
        ,streetlight_id
      );
    }else{
      return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
    }
  }

      
  /**
  *  Channel for when the streetlight is turned on
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToStreetlightStreetlightIdEventTurnon(
    onRequest : (
      err?: NatsTypescriptTemplateError, 
      msg?: GeneralReplyMessage.GeneralReply,streetlight_id?: string
    ) =>Promise<AnonymousMessage3Message.AnonymousMessage3>, onReplyError : (err: NatsTypescriptTemplateError) => void 
  
    ,streetlight_id: string
  ): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    
    if(nc){
      return streetlightStreetlightIdEventTurnonChannel.reply(onRequest, onReplyError, nc
      
        ,streetlight_id
      );
    }else{
      return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
    }
  }


}