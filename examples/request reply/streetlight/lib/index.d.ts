/// <reference types="node" />
import { AvailableHooks, ReceivedDataHook, BeforeSendingDataHook, Hooks } from './hooks';
import * as TestClient from './testclient/';
import { ErrorCode, NatsTypescriptTemplateError } from './NatsTypescriptTemplateError';
import { Client, NatsConnectionOptions, Subscription, ServersChangedEvent, SubEvent, ServerInfo, SubscriptionOptions } from 'ts-nats';
import * as streetlightStreetlightIdCommandTurnonChannel from "./channels/StreetlightStreetlightIdCommandTurnon";
import * as streetlightStreetlightIdEventTurnonChannel from "./channels/StreetlightStreetlightIdEventTurnon";
import { AnonymousSchema_1 } from "./schemas/AnonymousSchema_1";
import { GeneralReply } from "./schemas/GeneralReply";
import { AnonymousSchema_5 } from "./schemas/AnonymousSchema_5";
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
export { GeneralReply };
export { AnonymousSchema_5 };
export { ErrorCode, NatsTypescriptTemplateError };
export { TestClient };
export { AvailableHooks, ReceivedDataHook, BeforeSendingDataHook, Hooks };
export { Client, ServerInfo, ServersChangedEvent, SubEvent };
export declare interface NatsAsyncApiClient {
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
 * @class NatsAsyncApiClient
 *
 * The generated client based on your AsyncAPI document.
 */
export declare class NatsAsyncApiClient extends events.EventEmitter {
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
    replyToStreetlightStreetlightIdCommandTurnon(onRequest: (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_1, streetlight_id?: string) => Promise<GeneralReply>, onReplyError: (err: NatsTypescriptTemplateError) => void, streetlight_id: string, flush?: boolean, options?: SubscriptionOptions): Promise<Subscription>;
    /**
     * Reply to the `streetlight/{streetlight_id}/event/turnon` channel
     *
     * Channel for when the streetlight is turned on
     *
     * @param requestMessage to send
     * @param streetlight_id parameter to use in topic
     */
    requestStreetlightStreetlightIdEventTurnon(requestMessage: AnonymousSchema_5, streetlight_id: string): Promise<GeneralReply>;
}
