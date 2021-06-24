import { AnonymousSchema_1 } from '../schemas/AnonymousSchema_1';
import { Client, Subscription, SubscriptionOptions } from 'ts-nats';
import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/command/turnon` channel
 *
 * @param onDataCallback to call when messages are received
 * @param client to subscribe with
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export declare function subscribe(onDataCallback: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_1, streetlight_id?: string) => void, client: Client, streetlight_id: string, options?: SubscriptionOptions): Promise<Subscription>;
