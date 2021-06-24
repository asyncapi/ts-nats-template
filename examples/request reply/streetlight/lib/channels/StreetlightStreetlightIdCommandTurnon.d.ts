import { AnonymousSchema_1 } from '../schemas/AnonymousSchema_1';
import { GeneralReply } from '../schemas/GeneralReply';
import { Client, Subscription, SubscriptionOptions } from 'ts-nats';
import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to setup reply to the `streetlight/{streetlight_id}/command/turnon` channel
 *
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export declare function reply(onRequest: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_1, streetlight_id?: string) => Promise<GeneralReply>, onReplyError: (err: NatsTypescriptTemplateError) => void, client: Client, streetlight_id: string, options?: SubscriptionOptions): Promise<Subscription>;
