import { AnonymousSchema_2 } from '../../schemas/AnonymousSchema_2';
import { GeneralReply } from '../../schemas/GeneralReply';
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
export declare function request(requestMessage: AnonymousSchema_2, client: Client, streetlight_id: string): Promise<GeneralReply>;
