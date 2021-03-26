import {
  AnonymousSchema_2
} from '../../schemas/AnonymousSchema_2';
import {
  GeneralReply
} from '../../schemas/GeneralReply';
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
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to send request to the `streetlight/{streetlight_id}/command/turnon` channel 
 * 
 * @param requestMessage to send
 * @param client to send request with
 * @param streetlight_id parameter to use in topic
 */
export function request(
  requestMessage: AnonymousSchema_2,
  client: Client, streetlight_id: string
): Promise < GeneralReply > {
  return new Promise(async (resolve, reject) => {
    let timeout = undefined;
    let msg;
    let dataToSend: any = requestMessage;
    try {
      try {
        let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
        for (let hook of beforeSendingHooks) {
          dataToSend = hook(dataToSend);
        }
      } catch (e) {
        const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
        throw error;
      }
      msg = await client.request(`streetlight.${streetlight_id}.command.turnon`, timeout, dataToSend)
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      return;
    }
    let receivedData: any = msg.data;
    try {
      try {
        let receivedDataHooks = Hooks.getInstance().getReceivedDataHook();
        for (let hook of receivedDataHooks) {
          receivedData = hook(receivedData);
        }
        undefined
      } catch (e) {
        const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
        throw error;
      }
    } catch (e) {
      reject(e)
      return;
    }
    resolve(receivedData);
  })
}