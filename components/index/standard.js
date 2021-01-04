import { Text } from "@asyncapi/generator-react-sdk";
import { containsBinaryPayload, containsStringPayload, containsJsonPayload} from "../../utils/general";
import { Bracket } from "../bracket";
export function Standard({asyncapi}){
    return <Text>
        private jsonClient?: Client;
        private stringClient?: Client;
        private binaryClient?: Client;
        private options?: NatsConnectionOptions;

            /**
            *
            * @param options options to use, payload is omitted if sat in the AsyncAPI document.
            */
        constructor() <Bracket>
            super();
        </Bracket>
        /**
        * Try to connect to the NATS server with the different payloads.
        */
        connect(options : NatsConnectionOptions): Promise{"<void>"}<Bracket>
            return new Promise(async (resolve: () ={">"} void, reject: (error: any) ={">"} void) ={">"} <Bracket>
            this.options = options;
            try<Bracket>

            {
                containsBinaryPayload(asyncapi) && 
                <Text>
                    if(!this.binaryClient || this.binaryClient!.isClosed())<Bracket>
                        this.options.payload = Payload.BINARY;
                        this.binaryClient = await connect(this.options);
                        this.chainEvents(this.binaryClient);
                    </Bracket>
                </Text>
            }

            {
                containsStringPayload(asyncapi) && 
                <Text>
                    if(!this.stringClient || this.stringClient!.isClosed())<Bracket>
                        this.options.payload = Payload.STRING;
                        this.stringClient = await connect(this.options);
                        this.chainEvents(this.stringClient);
                    </Bracket>
                </Text>
            }

            {
                containsJsonPayload(asyncapi) && 
                <Text>
                    if(!this.jsonClient || this.jsonClient!.isClosed())<Bracket>
                        this.options.payload = Payload.JSON;
                        this.jsonClient = await connect(this.options);
                        this.chainEvents(this.jsonClient);
                    </Bracket>
                </Text>
            }
                resolve();
            </Bracket>catch(e)<Bracket>
                reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
            </Bracket>
            </Bracket>)
        </Bracket>

        /**
        * Returns whether or not any of the clients are closed
        */
        isClosed()<Bracket>
            {
                containsBinaryPayload(asyncapi) && 
                <Text>
                    if (!this.binaryClient || this.binaryClient!.isClosed())<Bracket>
                        return true;
                    </Bracket>
                </Text>
            }

            {
                containsStringPayload(asyncapi) && 
                <Text>
                    if (!this.stringClient || this.stringClient!.isClosed())<Bracket>
                        return true;
                    </Bracket>
                </Text>
            }

            {
                containsJsonPayload(asyncapi) && 
                <Text>
                    if (!this.jsonClient || this.jsonClient!.isClosed())<Bracket>
                        return true;
                    </Bracket>
                </Text>
            }
            return false;
        </Bracket>
        
        /**
        * Disconnect all clients from the server
        */
        async disconnect()<Bracket>
            if(!this.isClosed())<Bracket>
                {
                    containsBinaryPayload(asyncapi) && 
                    <Text>
                        await this.binaryClient!.drain();
                    </Text>
                }

                {
                    containsStringPayload(asyncapi) && 
                    <Text>
                        await this.stringClient!.drain();
                    </Text>
                }

                {
                    containsJsonPayload(asyncapi) && 
                    <Text>
                        await this.jsonClient!.drain();
                    </Text>
                }
            </Bracket>
        </Bracket>
        
        private chainEvents(ns: Client)<Bracket>
            ns.on('permissionError', (e: NatsError) ={">"} <Bracket>
                this.emit(AvailableEvents.permissionError, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
            </Bracket>);
            ns.on('close', (e: NatsError) ={">"} <Bracket>
                this.emit(AvailableEvents.close, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
            </Bracket>);
            ns.on('connect', (connection: Client, serverURL: string, info: ServerInfo) ={">"} <Bracket>
                this.emit(AvailableEvents.connect, connection, serverURL, info)
            </Bracket>);
            ns.on('connecting', (serverURL: string) ={">"} <Bracket>
                this.emit(AvailableEvents.connecting, serverURL)
            </Bracket>);
            ns.on('disconnect', (serverURL: string) ={">"} <Bracket>
                this.emit(AvailableEvents.disconnect, serverURL)
            </Bracket>);
            ns.on('error', (e: NatsError) ={">"} <Bracket>
                this.emit(AvailableEvents.error, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
            </Bracket>);
            ns.on('pingcount', () ={">"} <Bracket>
                this.emit(AvailableEvents.pingcount)
            </Bracket>);
            ns.on('pingtimer', () ={">"} <Bracket>
                this.emit(AvailableEvents.pingtimer)
            </Bracket>);
            ns.on('reconnect', (connection: Client, serverURL: string, info: ServerInfo) ={">"} <Bracket>
                this.emit(AvailableEvents.reconnect, connection, serverURL, info)
            </Bracket>);
            ns.on('reconnecting', (serverURL: string) ={">"} <Bracket>
                this.emit(AvailableEvents.reconnecting, serverURL)
            </Bracket>);
            ns.on('serversChanged', (e: ServersChangedEvent) ={">"} <Bracket>
                this.emit(AvailableEvents.serversChanged, e)
            </Bracket>);
            ns.on('subscribe', (e: SubEvent) ={">"} <Bracket>
                this.emit(AvailableEvents.subscribe, e)
            </Bracket>);
            ns.on('unsubscribe', (e: SubEvent) ={">"} <Bracket>
                this.emit(AvailableEvents.unsubscribe, e)
            </Bracket>);
            ns.on('yield', () ={">"} <Bracket>
                this.emit(AvailableEvents.yield)
            </Bracket>);
        </Bracket>
        
        /**
        * Try to connect to the NATS server with user credentials
        */
        async connectWithUserCreds(userCreds: string, options?: NatsConnectionOptions)<Bracket>
            await this.connect(<Bracket>
            userCreds: userCreds,
            ... options
            </Bracket>);
        </Bracket>
        /**
        * Try to connect to the NATS server with user and password
        */
        async connectWithUserPass(user: string, pass: string, options?: NatsConnectionOptions)<Bracket>
            await this.connect(<Bracket>
            user: user,
            pass: pass,
            ... options
            </Bracket>);
        </Bracket>
        
        /**
        * Try to connect to the NATS server which has no authentication
        */
        async connectToHost(host: string, options?: NatsConnectionOptions)<Bracket>
            await this.connect(<Bracket>
            servers: [host],
            ... options
            </Bracket>);
        </Bracket>

        /**
        * Try to connect to the NATS server with nkey authentication
        */
        async connectWithNkey(publicNkey: string, seed: string, options?: NatsConnectionOptions)<Bracket>
            await this.connect(<Bracket>
            nkey: publicNkey,
            nonceSigner: (nonce: string): Buffer ={">"} <Bracket>
                const sk = fromSeed(Buffer.from(seed));
                return sk.sign(Buffer.from(nonce));
            </Bracket>,
            ... options
            </Bracket>);
        </Bracket>
    </Text>
}