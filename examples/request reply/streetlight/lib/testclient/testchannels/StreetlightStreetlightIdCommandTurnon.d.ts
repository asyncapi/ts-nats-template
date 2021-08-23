import { AnonymousSchema_1 } from '../../models/AnonymousSchema_1';
import { GeneralReply } from '../../models/GeneralReply';
import { Client } from 'ts-nats';
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
export declare function request(requestMessage: AnonymousSchema_1, client: Client, streetlight_id: string): Promise<GeneralReply>;
