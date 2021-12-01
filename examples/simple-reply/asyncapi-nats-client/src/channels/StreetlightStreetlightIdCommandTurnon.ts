import {
  TurnOnRequest
} from '../models/TurnOnRequest';
import {
  GeneralReply
} from '../models/GeneralReply';
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
 * Internal functionality to setup reply to the `streetlight/{streetlight_id}/command/turnon` channel
 * 
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export function reply(
  onRequest: (
    err ? : NatsTypescriptTemplateError,
    msg ? : TurnOnRequest, streetlight_id ? : string
  ) => Promise < GeneralReply > ,
  onReplyError: (err: NatsTypescriptTemplateError) => void,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , streetlight_id: string,
  options ? : Nats.SubscriptionOptions
): Promise < Nats.Subscription > {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: Nats.SubscriptionOptions = {
        ...options
      };
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
          let replyMessage = await onRequest(undefined, TurnOnRequest.unmarshal(receivedData), streetlightIdParam);
          if (msg.reply) {
            let dataToSend: any = replyMessage.marshal();
            dataToSend = codec.encode(dataToSend);
            msg.respond(dataToSend);
          } else {
            let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
            onReplyError(error)
            return;
          }
        }
      })();
      resolve(subscription);
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}