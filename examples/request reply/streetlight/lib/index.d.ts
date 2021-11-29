import * as TestClient from './testclient/';
import { ErrorCode, NatsTypescriptTemplateError } from './NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./channels/StreetlightStreetlightIdCommandTurnon";
import * as streetlightStreetlightIdEventTurnonChannel from "./channels/StreetlightStreetlightIdEventTurnon";
import { AnonymousSchema_1 } from "./models/AnonymousSchema_1";
import { GeneralReply } from "./models/GeneralReply";
import { AnonymousSchema_5 } from "./models/AnonymousSchema_5";
export { streetlightStreetlightIdCommandTurnonChannel };
export { streetlightStreetlightIdEventTurnonChannel };
export { AnonymousSchema_1 };
export { GeneralReply };
export { AnonymousSchema_5 };
export { ErrorCode, NatsTypescriptTemplateError };
export { TestClient };
/**
 * @class NatsAsyncApiClient
 *
 * The generated client based on your AsyncAPI document.
 */
export declare class NatsAsyncApiClient {
    private nc?;
    private codec?;
    private options?;
    /**
     * Try to connect to the NATS server with the different payloads.
     * @param options to use, payload is omitted if sat in the AsyncAPI document.
     */
    connect(options: Nats.ConnectionOptions, codec?: Nats.Codec<any>): Promise<void>;
    /**
     * Disconnect all clients from the server
     */
    disconnect(): Promise<void>;
    /**
     * Returns whether or not any of the clients are closed
     */
    isClosed(): boolean;
    /**
     * Try to connect to the NATS server with user credentials
     *
     * @param userCreds to use
     * @param options to connect with
     */
    connectWithUserCreds(userCreds: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>): Promise<void>;
    /**
     * Try to connect to the NATS server with user and password
     *
     * @param user username to use
     * @param pass password to use
     * @param options to connect with
     */
    connectWithUserPass(user: string, pass: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>): Promise<void>;
    /**
     * Try to connect to the NATS server which has no authentication
     
      * @param host to connect to
      * @param options to connect with
      */
    connectToHost(host: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>): Promise<void>;
    /**
     * Reply to the `streetlight/{streetlight_id}/command/turnon` channel
     *
     * Channel for the turn on command which should turn on the streetlight
     *
     * @param onRequest called when request is received
     * @param onReplyError called when it was not possible to send the reply
     * @param streetlight_id parameter to use in topic
     * @param flush ensure client is force flushed after subscribing
     * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
     */
    replyToStreetlightStreetlightIdCommandTurnon(onRequest: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_1, streetlight_id?: string) => Promise<GeneralReply>, onReplyError: (err: NatsTypescriptTemplateError) => void, streetlight_id: string, flush?: boolean, options?: Nats.SubscriptionOptions): Promise<Nats.Subscription>;
    /**
     * Reply to the `streetlight/{streetlight_id}/event/turnon` channel
     *
     * Channel for when the streetlight is turned on
     *
     * @param requestMessage to send
     * @param streetlight_id parameter to use in topic
     */
    requestStreetlightStreetlightIdEventTurnon(requestMessage: AnonymousSchema_5, streetlight_id: string, options?: Nats.RequestOptions): Promise<GeneralReply>;
}
