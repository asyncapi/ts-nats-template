import GeneralReply from '../models/GeneralReply';
import TurnOnRequest from '../models/TurnOnRequest';
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
 * Internal functionality to send request to the `streetlight/{streetlight_id}/event/turnon` channel 
 * 
 * @param requestMessage to send
 * @param nc to send request with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to use for the request
 */
export function request(
  requestMessage: TurnOnRequest,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , streetlight_id: string,
  options ? : Nats.RequestOptions
): Promise < GeneralReply > {
  return new Promise(async (resolve, reject) => {
    try {
      let dataToSend: any = codec.encode(requestMessage.marshal());
      const msg = await nc.request(`streetlight.${streetlight_id}.event.turnon`, dataToSend, options)
      let receivedData = codec.decode(msg.data);
      resolve(GeneralReply.unmarshal(receivedData));
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      return;
    }
  })
}