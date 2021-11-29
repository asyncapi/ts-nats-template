import {
  AnonymousSchema_3
} from '../../models/AnonymousSchema_3';
import * as Nats from 'nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/event/turnon` channel 
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
    msg ? : AnonymousSchema_3, streetlight_id ? : string) => void,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , streetlight_id: string,
  options ? : Nats.SubscriptionOptions
): Promise < Nats.Subscription > {
  return new Promise(async (resolve, reject) => {
    let subscribeOptions: Nats.SubscriptionOptions = {
      ...options
    };
    try {
      let subscription = nc.subscribe(`streetlight.${streetlight_id}.event.turnon`, subscribeOptions);
      (async () => {
        for await (const msg of subscription) {
          const unmodifiedChannel = `streetlight.{streetlight_id}.event.turnon`;
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
          onDataCallback(undefined, AnonymousSchema_3.unmarshal(receivedData), streetlightIdParam);
        }
        console.log("subscription closed");
      })();
      resolve(subscription);
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}