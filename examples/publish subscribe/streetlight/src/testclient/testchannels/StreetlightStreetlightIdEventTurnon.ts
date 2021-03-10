import {
  AnonymousSchema_5
} from '../../schemas/AnonymousSchema_5';
import {
  Client,
  NatsError,
  Subscription,
  SubscriptionOptions,
  Payload
} from 'ts-nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../../NatsTypescriptTemplateError';
import {
  Hooks
} from '../../hooks';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/event/turnon` channel 
 * 
 * @param onDataCallback to call when messages are received
 * @param client to subscribe with
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export function subscribe(
  onDataCallback: (
    err ? : NatsTypescriptTemplateError,
    msg ? : AnonymousSchema_5, streetlight_id ? : string) => void,
  client: Client, streetlight_id: string,
  options ? : SubscriptionOptions
): Promise < Subscription > {
  return new Promise(async (resolve, reject) => {
    let subscribeOptions: SubscriptionOptions = {
      ...options
    };
    try {
      let subscription = await client.subscribe(`streetlight.${streetlight_id}.event.turnon`, (err, msg) => {
        if (err) {
          onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
        } else {
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
          let receivedData: any = msg.data;
          try {
            try {
              let receivedDataHooks = Hooks.getInstance().getReceivedDataHook();
              for (let hook of receivedDataHooks) {
                receivedData = hook(receivedData);
              }
              if (receivedDataHooks.length == 0) {
                receivedData = receivedData;
              }
            } catch (e) {
              const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
              throw error;
            }
          } catch (e) {
            onDataCallback(e)
            return;
          }
          onDataCallback(undefined, receivedData, streetlightIdParam);
        }
      }, subscribeOptions);
      resolve(subscription);
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}