import TurnOn from '../models/TurnOn';
import * as Nats from 'nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/command/turnon` channel 
 * 
 * @param onDataCallback to call when messages are received
 * @param nc to subscribe with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export function subscribe(
  onDataCallback: (
    err ? : NatsTypescriptTemplateError,
    msg ? : TurnOn, streetlight_id ? : string) => void,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , streetlight_id: string,
  options ? : Nats.SubscriptionOptions
): Promise < Nats.Subscription > {
  return new Promise(async (resolve, reject) => {
    let subscribeOptions: Nats.SubscriptionOptions = {
      ...options
    };
    try {
      let subscription = nc.subscribe(`streetlight.${streetlight_id}.command.turnon`, subscribeOptions);
      (async () => {
        for await (const msg of subscription) {
          const unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
          let channel = msg.subject;
          const streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");
          const splits = [
            streetlightIdSplit[0],
            streetlightIdSplit[1]
          ];
          channel = channel.substring(splits[0].length);
          const streetlightIdEnd = channel.indexOf(splits[1]);
          const streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);
          let receivedData: any = codec.decode(msg.data);
          onDataCallback(undefined, TurnOn.unmarshal(receivedData), streetlightIdParam);
        }
        console.log("subscription closed");
      })();
      resolve(subscription);
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}
/**
 * Internal functionality to setup jetstream pull subscription on the `streetlight/{streetlight_id}/command/turnon` channel 
 * 
 * @param onDataCallback to call when messages are received
 * @param nc to subscribe with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 */
export function jetStreamPullSubscribe(
  onDataCallback: (
    err ? : NatsTypescriptTemplateError,
    msg ? : TurnOn, streetlight_id ? : string,
    jetstreamMsg ? : Nats.JsMsg) => void,
  js: Nats.JetStreamClient,
  codec: Nats.Codec < any > , streetlight_id: string,
  options: Nats.ConsumerOptsBuilder | Partial < Nats.ConsumerOpts >
): Promise < Nats.JetStreamPullSubscription > {
  return new Promise(async (resolve, reject) => {
    try {
      const subscription = await js.pullSubscribe(`streetlight.${streetlight_id}.command.turnon`, options);
      (async () => {
        for await (const msg of subscription) {
          const unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
          let channel = msg.subject;
          const streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");
          const splits = [
            streetlightIdSplit[0],
            streetlightIdSplit[1]
          ];
          channel = channel.substring(splits[0].length);
          const streetlightIdEnd = channel.indexOf(splits[1]);
          const streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);
          let receivedData: any = codec.decode(msg.data);
          onDataCallback(undefined, TurnOn.unmarshal(receivedData), streetlightIdParam);
        }
      })();
      resolve(subscription);
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}