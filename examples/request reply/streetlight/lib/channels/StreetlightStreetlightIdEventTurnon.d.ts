import { GeneralReply } from '../schemas/GeneralReply';
import { AnonymousSchema_7 } from '../schemas/AnonymousSchema_7';
import { Client } from 'ts-nats';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to send request to the `streetlight/{streetlight_id}/event/turnon` channel
 *
 * @param requestMessage to send
 * @param client to send request with
 * @param streetlight_id parameter to use in topic
 */
export declare function request(requestMessage: AnonymousSchema_7, client: Client, streetlight_id: string): Promise<GeneralReply>;
