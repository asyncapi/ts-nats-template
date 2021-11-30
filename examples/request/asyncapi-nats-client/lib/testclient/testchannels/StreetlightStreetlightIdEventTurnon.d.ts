import { GeneralReply } from '../../models/GeneralReply';
import { AnonymousSchema_3 } from '../../models/AnonymousSchema_3';
import * as Nats from 'nats';
import { NatsTypescriptTemplateError } from '../../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to setup reply to the `streetlight/{streetlight_id}/event/turnon` channel
 *
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export declare function reply(onRequest: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_3, streetlight_id?: string) => Promise<GeneralReply>, onReplyError: (err: NatsTypescriptTemplateError) => void, nc: Nats.NatsConnection, codec: Nats.Codec<any>, streetlight_id: string, options?: Nats.SubscriptionOptions): Promise<Nats.Subscription>;
