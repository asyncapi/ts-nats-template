import {
  AnonymousSchema_2
} from '../schemas/AnonymousSchema_2';
import {
  GeneralReply
} from '../schemas/GeneralReply';
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
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to setup reply to the `streetlight/{streetlight_id}/command/turnon` channel
 * 
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export function reply(
  onRequest: (
    err ? : NatsTypescriptTemplateError,
    msg ? : AnonymousSchema_2, streetlight_id ? : string
  ) => Promise < GeneralReply > ,
  onReplyError: (err: NatsTypescriptTemplateError) => void,
  client: Client, streetlight_id: string,
  options ? : SubscriptionOptions
): Promise < Subscription > {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: SubscriptionOptions = {
        ...options
      };
      let subscription = await client.subscribe(`streetlight.${streetlight_id}.command.turnon`, async (err, msg) => {
        if (err) {
          onRequest(err);
        } else {
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
            onReplyError(e)
            return;
          }
          let message = await onRequest(undefined, receivedData, streetlightIdParam);
          if (msg.reply) {
            let dataToSend: any = message;
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
            } catch (e) {
              onReplyError(e)
              return;
            }
            await client.publish(msg.reply, dataToSend);
          } else {
            let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
            onReplyError(error)
            return;
          }
        }
      }, subscribeOptions);
      resolve(subscription);
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}