import { AnonymousSchema_2 } from '../../schemas/AnonymousSchema_2';
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
export declare function publish(message: AnonymousSchema_2, client: Client, streetlight_id: string): Promise<void>;
