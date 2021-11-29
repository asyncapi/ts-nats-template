import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
import * as streetlightStreetlightIdEventTurnonChannel from "./testchannels/StreetlightStreetlightIdEventTurnon";
import { AnonymousSchema_1 } from "../models/AnonymousSchema_1";
import { AnonymousSchema_3 } from "../models/AnonymousSchema_3";
export { streetlightStreetlightIdCommandTurnonChannel };
export { streetlightStreetlightIdEventTurnonChannel };
export { AnonymousSchema_1 };
export { AnonymousSchema_3 };
/**
 * @class NatsAsyncApiTestClient
 *
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
export declare class NatsAsyncApiTestClient {
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
     * Publish to the `streetlight/{streetlight_id}/command/turnon` channel
     *
     * Channel for the turn on command which should turn on the streetlight
     *
     * @param message to publish
     * @param streetlight_id parameter to use in topic
     */
    publishToStreetlightStreetlightIdCommandTurnon(message: AnonymousSchema_1, streetlight_id: string, options?: Nats.PublishOptions): Promise<void>;
    /**
     * Subscribe to the `streetlight/{streetlight_id}/event/turnon`
     *
     * Channel for when the streetlight is turned on
     *
     * @param onDataCallback to call when messages are received
     * @param streetlight_id parameter to use in topic
     * @param flush ensure client is force flushed after subscribing
     * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
     */
    subscribeToStreetlightStreetlightIdEventTurnon(onDataCallback: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_3, streetlight_id?: string) => void, streetlight_id: string, flush?: boolean, options?: Nats.SubscriptionOptions): Promise<Nats.Subscription>;
}
