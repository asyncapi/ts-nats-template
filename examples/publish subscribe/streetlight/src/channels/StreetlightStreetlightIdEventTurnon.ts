import {
  AnonymousSchema_3
} from '../schemas/AnonymousSchema_3';
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
} from '../NatsTypescriptTemplateError';
import {
  Hooks
} from '../hooks';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to publish message to channel 
 * streetlight/{streetlight_id}/event/turnon
 * 
 * @param message to publish
 * @param client to publish with
 * @param streetlight_id parameter to use in topic
 */
export function publish(
  message: AnonymousSchema_3,
  client: Client, streetlight_id: string
): Promise < void > {
  return new Promise < void > (async (resolve, reject) => {
    try {
      let dataToSend: any = message;
      try {
        let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
        for (let hook of beforeSendingHooks) {
          dataToSend = hook(dataToSend);
        }
      } catch (e) {
        const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
        throw error;
      }
      await client.publish(`streetlight.${streetlight_id}.event.turnon`, dataToSend);
      resolve();
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  });
};