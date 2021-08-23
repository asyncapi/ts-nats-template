import { AnonymousSchema_1 } from '../../models/AnonymousSchema_1';
import { Client } from 'ts-nats';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to publish message to channel
 * streetlight/{streetlight_id}/command/turnon
 *
 * @param message to publish
 * @param client to publish with
 * @param streetlight_id parameter to use in topic
 */
export declare function publish(message: AnonymousSchema_1, client: Client, streetlight_id: string): Promise<void>;
