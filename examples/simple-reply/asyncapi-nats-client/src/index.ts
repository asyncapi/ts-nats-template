import * as TestClient from './testclient/';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from './NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./channels/StreetlightStreetlightIdCommandTurnon";
import {
  TurnOnRequest
} from "./models/TurnOnRequest";
import {
  GeneralReply
} from "./models/GeneralReply";
export {
  streetlightStreetlightIdCommandTurnonChannel
};
export {
  TurnOnRequest
};
export {
  GeneralReply
};
export {
  ErrorCode,
  NatsTypescriptTemplateError
}
export {
  TestClient
};
/**
 * @class NatsAsyncApiClient
 * 
 * The generated client based on your AsyncAPI document.
 */
export class NatsAsyncApiClient {
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
   * Reply to the `streetlight/{streetlight_id}/command/turnon` channel 
   * 
   * Channel for the turn on command which should turn on the streetlight
   * 
   * @param onRequest called when request is received
   * @param onReplyError called when it was not possible to send the reply
   * @param streetlight_id parameter to use in topic
   * @param flush ensure client is force flushed after subscribing
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
  public replyToStreetlightStreetlightIdCommandTurnon(
    onRequest: (
      err ? : NatsTypescriptTemplateError,
      msg ? : TurnOnRequest, streetlight_id ? : string
    ) => Promise < GeneralReply > ,
    onReplyError: (err: NatsTypescriptTemplateError) => void, streetlight_id: string,
    flush ? : boolean,
    options ? : Nats.SubscriptionOptions
  ): Promise < Nats.Subscription > {
    return new Promise(async (resolve, reject) => {
      if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
        try {
          const sub = await streetlightStreetlightIdCommandTurnonChannel.reply(
            onRequest,
            onReplyError,
            this.nc,
            this.codec, streetlight_id,
            options
          );
          if (flush) {
            await this.nc!.flush();
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