import { GeneralReply } from '../models/GeneralReply';
import { AnonymousSchema_3 } from '../models/AnonymousSchema_3';
import * as Nats from 'nats';
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
export declare function request(requestMessage: AnonymousSchema_3, nc: Nats.NatsConnection, codec: Nats.Codec<any>, streetlight_id: string, options?: Nats.RequestOptions): Promise<GeneralReply>;
