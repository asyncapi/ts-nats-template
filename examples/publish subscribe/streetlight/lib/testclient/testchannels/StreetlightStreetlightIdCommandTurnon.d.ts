import { AnonymousSchema_1 } from '../../models/AnonymousSchema_1';
import * as Nats from 'nats';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to publish message to channel
 * streetlight/{streetlight_id}/command/turnon
 *
 * @param message to publish
 * @param nc to publish with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to publish with
 */
export declare function publish(message: AnonymousSchema_1, nc: Nats.NatsConnection, codec: Nats.Codec<any>, streetlight_id: string, options?: Nats.PublishOptions): Promise<void>;
