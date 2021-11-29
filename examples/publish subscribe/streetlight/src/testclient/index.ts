import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
import * as streetlightStreetlightIdEventTurnonChannel from "./testchannels/StreetlightStreetlightIdEventTurnon";
import {
  AnonymousSchema_1
} from "../models/AnonymousSchema_1";
import {
  AnonymousSchema_3
} from "../models/AnonymousSchema_3";
export {
  streetlightStreetlightIdCommandTurnonChannel
};
export {
  streetlightStreetlightIdEventTurnonChannel
};
export {
  AnonymousSchema_1
};
export {
  AnonymousSchema_3
};
/**
 * @class NatsAsyncApiTestClient
 * 
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
export class NatsAsyncApiTestClient {
  private nc ? : Nats.NatsConnection;
  private codec ? : Nats.Codec < any > ;
  private options ? : Nats.ConnectionOptions;
  /**
   * Try to connect to the NATS server with the different payloads.
   * @param options to use, payload is omitted if sat in the AsyncAPI document.
   */
  connect(options: Nats.ConnectionOptions, codec ? : Nats.Codec < any > ): Promise < void > {
    return new Promise(async (resolve: () => void, reject: (error: any) => void) => {
      if (!this.isClosed()) {
        return reject('Client is still connected, please close it first.');
      }
      this.options = options;
      if (codec) {
        this.codec = codec;
      } else {
        this.codec = Nats.JSONCodec();
      }
      try {
        this.nc = await Nats.connect(this.options);
        resolve();
      } catch (e: any) {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }
  /**
   * Disconnect all clients from the server
   */
  async disconnect() {
    if (!this.isClosed() && this.nc !== undefined) {
      await this.nc.drain();
    }
  }
  /**
   * Returns whether or not any of the clients are closed
   */
  isClosed() {
    if (!this.nc || this.nc!.isClosed()) {
      return true;
    }
    return false;
  }
  /**
   * Try to connect to the NATS server with user credentials
   *
   * @param userCreds to use
   * @param options to connect with
   */
  async connectWithUserCreds(userCreds: string, options ? : Nats.ConnectionOptions, codec ? : Nats.Codec < any > ) {
    await this.connect({
      user: userCreds,
      ...options
    }, codec);
  }
  /**
   * Try to connect to the NATS server with user and password
   * 
   * @param user username to use
   * @param pass password to use
   * @param options to connect with
   */
  async connectWithUserPass(user: string, pass: string, options ? : Nats.ConnectionOptions, codec ? : Nats.Codec < any > ) {
    await this.connect({
      user: user,
      pass: pass,
      ...options
    }, codec);
  }
  /**
   * Try to connect to the NATS server which has no authentication
   
    * @param host to connect to
    * @param options to connect with
    */
  async connectToHost(host: string, options ? : Nats.ConnectionOptions, codec ? : Nats.Codec < any > ) {
    await this.connect({
      servers: [host],
      ...options
    }, codec);
  }
  /**
   * Publish to the `streetlight/{streetlight_id}/command/turnon` channel 
   * 
   * Channel for the turn on command which should turn on the streetlight
   * 
   * @param message to publish
   * @param streetlight_id parameter to use in topic
   */
  public publishToStreetlightStreetlightIdCommandTurnon(
    message: AnonymousSchema_1, streetlight_id: string,
    options ? : Nats.PublishOptions
  ): Promise < void > {
    if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
      return streetlightStreetlightIdCommandTurnonChannel.publish(
        message,
        this.nc,
        this.codec, streetlight_id,
        options
      );
    } else {
      return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
    }
  }
  /**
   * Subscribe to the `streetlight/{streetlight_id}/event/turnon`
   * 
   * Channel for when the streetlight is turned on
   * 
   * @param onDataCallback to call when messages are received
   * @param streetlight_id parameter to use in topic
   * @param flush ensure client is force flushed after subscribing
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
  public subscribeToStreetlightStreetlightIdEventTurnon(
    onDataCallback: (
      err ? : NatsTypescriptTemplateError,
      msg ? : AnonymousSchema_3, streetlight_id ? : string) => void, streetlight_id: string,
    flush ? : boolean,
    options ? : Nats.SubscriptionOptions
  ): Promise < Nats.Subscription > {
    return new Promise(async (resolve, reject) => {
      if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
        try {
          const sub = await streetlightStreetlightIdEventTurnonChannel.subscribe(
            onDataCallback,
            this.nc,
            this.codec, streetlight_id,
            options
          );
          if (flush) {
            await this.nc.flush();
          }
          resolve(sub);
        } catch (e: any) {
          reject(e);
        }
      } else {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
      }
    });
  }
}