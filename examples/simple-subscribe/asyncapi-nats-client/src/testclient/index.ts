import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
import TurnOn from "../models/TurnOn";
export {
  streetlightStreetlightIdCommandTurnonChannel
};
export {
  TurnOn
};
/**
 * @class NatsAsyncApiTestClient
 * 
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
export class NatsAsyncApiTestClient {
  private nc ? : Nats.NatsConnection;
  private js ? : Nats.JetStreamClient;
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
        this.js = this.nc.jetstream();
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
   * Connects the client to the AsyncAPI server called local.
   * Local server used during development and testing
   */
  async connectToLocal(codec ? : Nats.Codec < any > ) {
    await this.connect({
      servers: ["localhost:4222"]
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
    message: TurnOn, streetlight_id: string,
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
   * Publish to the `streetlight/{streetlight_id}/command/turnon` jetstream channel 
   * 
   * Channel for the turn on command which should turn on the streetlight
   * 
   * @param message to publish
   * @param streetlight_id parameter to use in topic
   */
  public jetStreamPublishToStreetlightStreetlightIdCommandTurnon(
    message: TurnOn, streetlight_id: string,
    options ? : Nats.PublishOptions
  ): Promise < void > {
    if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined && this.js !== undefined) {
      return streetlightStreetlightIdCommandTurnonChannel.jetStreamPublish(
        message,
        this.js,
        this.codec, streetlight_id,
        options
      );
    } else {
      return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
    }
  }
}