import {
  AnonymousSchema_3
} from '../models/AnonymousSchema_3';
import * as Nats from 'nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to publish message to channel 
 * streetlight/{streetlight_id}/event/turnon
 * 
 * @param message to publish
 * @param nc to publish with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to publish with
 */
export function publish(
  message: AnonymousSchema_3,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , streetlight_id: string,
  options ? : Nats.PublishOptions
): Promise < void > {
  return new Promise < void > (async (resolve, reject) => {
    try {
      let dataToSend: any = message.marshal();
      dataToSend = codec.encode(dataToSend);
      nc.publish(`streetlight.${streetlight_id}.event.turnon`, dataToSend, options);
      resolve();
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  });
};