import * as TestClient from './testclient/';
import { ErrorCode, NatsTypescriptTemplateError } from './NatsTypescriptTemplateError';
import * as Nats from 'nats';
import * as streetlightStreetlightIdEventTurnonChannel from "./channels/StreetlightStreetlightIdEventTurnon";
import { GeneralReply } from "./models/GeneralReply";
import { AnonymousSchema_3 } from "./models/AnonymousSchema_3";
export { streetlightStreetlightIdEventTurnonChannel };
export { GeneralReply };
export { AnonymousSchema_3 };
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
     * Connects the client to the AsyncAPI server called local.
     * Local server used during development and testing
     */
    connectToLocal(codec?: Nats.Codec<any>): Promise<void>;
    /**
     * Reply to the `streetlight/{streetlight_id}/event/turnon` channel
     *
     * Channel for when the streetlight is turned on
     *
     * @param requestMessage to send
     * @param streetlight_id parameter to use in topic
     */
    requestStreetlightStreetlightIdEventTurnon(requestMessage: AnonymousSchema_3, streetlight_id: string, options?: Nats.RequestOptions): Promise<GeneralReply>;
}
