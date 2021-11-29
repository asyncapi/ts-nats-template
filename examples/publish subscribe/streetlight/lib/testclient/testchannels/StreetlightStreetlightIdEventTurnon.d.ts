import { AnonymousSchema_3 } from '../../models/AnonymousSchema_3';
import * as Nats from 'nats';
import { NatsTypescriptTemplateError } from '../../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/event/turnon` channel
 *
 * @param onDataCallback to call when messages are received
 * @param nc to subscribe with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export declare function subscribe(onDataCallback: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_3, streetlight_id?: string) => void, nc: Nats.NatsConnection, codec: Nats.Codec<any>, streetlight_id: string, options?: Nats.SubscriptionOptions): Promise<Nats.Subscription>;
