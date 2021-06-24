import { AnonymousSchema_3 } from '../schemas/AnonymousSchema_3';
import { Client } from 'ts-nats';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to publish message to channel
 * streetlight/{streetlight_id}/event/turnon
 *
 * @param message to publish
 * @param client to publish with
 * @param streetlight_id parameter to use in topic
 */
export declare function publish(message: AnonymousSchema_3, client: Client, streetlight_id: string): Promise<void>;
