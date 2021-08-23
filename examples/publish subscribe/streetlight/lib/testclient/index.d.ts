/// <reference types="node" />
import { NatsTypescriptTemplateError } from '..//NatsTypescriptTemplateError';
import { Client, NatsConnectionOptions, Subscription, ServersChangedEvent, SubEvent, ServerInfo, SubscriptionOptions } from 'ts-nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
import * as streetlightStreetlightIdEventTurnonChannel from "./testchannels/StreetlightStreetlightIdEventTurnon";
import { AnonymousSchema_1 } from "..//models/AnonymousSchema_1";
import { AnonymousSchema_3 } from "..//models/AnonymousSchema_3";
import * as events from 'events';
export declare enum AvailableEvents {
    permissionError = "permissionError",
    close = "close",
    connect = "connect",
    connecting = "connecting",
    disconnect = "disconnect",
    error = "error",
    pingcount = "pingcount",
    pingtimer = "pingtimer",
    reconnect = "reconnect",
    reconnecting = "reconnecting",
    serversChanged = "serversChanged",
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    yield = "yield"
}
export { streetlightStreetlightIdCommandTurnonChannel };
export { streetlightStreetlightIdEventTurnonChannel };
export { AnonymousSchema_1 };
export { AnonymousSchema_3 };
export declare interface NatsAsyncApiTestClient {
    on(event: AvailableEvents.permissionError, listener: (error: NatsTypescriptTemplateError) => void): this;
    on(event: AvailableEvents.close, listener: (error: NatsTypescriptTemplateError) => void): this;
    on(event: AvailableEvents.connect, listener: (connection: Client, serverURL: string, info: ServerInfo) => void): this;
    on(event: AvailableEvents.connecting, listener: (error: NatsTypescriptTemplateError) => void): this;
    on(event: AvailableEvents.disconnect, listener: (serverURL: string) => void): this;
    on(event: AvailableEvents.error, listener: (error: NatsTypescriptTemplateError) => void): this;
    on(event: AvailableEvents.pingcount, listener: () => void): this;
    on(event: AvailableEvents.pingtimer, listener: () => void): this;
    on(event: AvailableEvents.reconnect, listener: (connection: Client, serverURL: string, info: ServerInfo) => void): this;
    on(event: AvailableEvents.reconnecting, listener: (serverURL: string) => void): this;
    on(event: AvailableEvents.serversChanged, listener: (e: ServersChangedEvent) => void): this;
    on(event: AvailableEvents.subscribe, listener: (e: SubEvent) => void): this;
    on(event: AvailableEvents.unsubscribe, listener: (e: SubEvent) => void): this;
    on(event: AvailableEvents.yield, listener: () => void): this;
}
/**
 * @class NatsAsyncApiTestClient
 *
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
export declare class NatsAsyncApiTestClient extends events.EventEmitter {
    private jsonClient?;
    private stringClient?;
    private binaryClient?;
    private options?;
    constructor();
    /**
     * Try to connect to the NATS server with the different payloads.
     * @param options to use, payload is omitted if sat in the AsyncAPI document.
     */
    connect(options: NatsConnectionOptions): Promise<void>;
    /**
     * Disconnect all clients from the server
     */
    disconnect(): Promise<void>;
    /**
     * Returns whether or not any of the clients are closed
     */
    isClosed(): boolean;
    private chainEvents;
    /**
     * Try to connect to the NATS server with user credentials
     *
     * @param userCreds to use
     * @param options to connect with
     */
    connectWithUserCreds(userCreds: string, options?: NatsConnectionOptions): Promise<void>;
    /**
     * Try to connect to the NATS server with user and password
     *
     * @param user username to use
     * @param pass password to use
     * @param options to connect with
     */
    connectWithUserPass(user: string, pass: string, options?: NatsConnectionOptions): Promise<void>;
    /**
     * Try to connect to the NATS server which has no authentication
     
     * @param host to connect to
     * @param options to connect with
     */
    connectToHost(host: string, options?: NatsConnectionOptions): Promise<void>;
    /**
     * Try to connect to the NATS server with NKey authentication
     *
     * @param publicNkey User
     * @param seed private key
     * @param options to connect with
     */
    connectWithNkey(publicNkey: string, seed: string, options?: NatsConnectionOptions): Promise<void>;
    /**
     * Publish to the `streetlight/{streetlight_id}/command/turnon` channel
     *
     * Channel for the turn on command which should turn on the streetlight
     *
     * @param message to publish
     * @param streetlight_id parameter to use in topic
     */
    publishToStreetlightStreetlightIdCommandTurnon(message: AnonymousSchema_1, streetlight_id: string): Promise<void>;
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
    subscribeToStreetlightStreetlightIdEventTurnon(onDataCallback: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_3, streetlight_id?: string) => void, streetlight_id: string, flush?: boolean, options?: SubscriptionOptions): Promise<Subscription>;
}
