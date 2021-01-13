import { containsBinaryPayload, containsStringPayload, containsJsonPayload } from '../../utils/index';


/**
 * Return disconnect function based on the payload
 * 
 * @param {*} asyncapi 
 */
function getDisconnectFunction(asyncapi){
  let disconnectWithBinaryClient = '';
  if(containsBinaryPayload(asyncapi)){
    disconnectWithBinaryClient = `await this.binaryClient!.drain();`;
  }

  let disconnectWithStringPayload = '';
  if(containsStringPayload(asyncapi)){
    disconnectWithStringPayload =   `await this.stringClient!.drain();`;
  }

  let disconnectWithJsonPayload = '';
  if(containsJsonPayload(asyncapi)){
    disconnectWithJsonPayload =  `await this.jsonClient!.drain();`;
  }

  return `        
    /**
     * Disconnect all clients from the server
     */
    async disconnect(){
      if(!this.isClosed()){
        ${disconnectWithBinaryClient}
        ${disconnectWithStringPayload}
        ${disconnectWithJsonPayload}
      }
    }`;
}

/**
 * Return connect function based on the payload
 * 
 * @param {*} asyncapi 
 */
function getConnectFunction(asyncapi){
  let connectWithBinaryClient = '';
  if(containsBinaryPayload(asyncapi)){
    connectWithBinaryClient = `
      if(!this.binaryClient || this.binaryClient!.isClosed()){
          this.options.payload = Payload.BINARY;
          this.binaryClient = await connect(this.options);
          this.chainEvents(this.binaryClient);
      }`;
  }

  let connectWithStringPayload = '';
  if(containsStringPayload(asyncapi)){
    connectWithStringPayload =   `
      if(!this.stringClient || this.stringClient!.isClosed()){
          this.options.payload = Payload.STRING;
          this.stringClient = await connect(this.options);
          this.chainEvents(this.stringClient);
      }`;
  }

  let connectWithJsonPayload = '';
  if(containsJsonPayload(asyncapi)){
    connectWithJsonPayload =  `
      if(!this.jsonClient || this.jsonClient!.isClosed()){
          this.options.payload = Payload.JSON;
          this.jsonClient = await connect(this.options);
          this.chainEvents(this.jsonClient);
      }`;
  }

  return `        
  /**
  * Try to connect to the NATS server with the different payloads.
  * @param options to use, payload is omitted if sat in the AsyncAPI document.
  */
  connect(options : NatsConnectionOptions): Promise<void>{
      return new Promise(async (resolve: () => void, reject: (error: any) => void) => {
          this.options = options;
          try {
              ${connectWithBinaryClient}
              ${connectWithStringPayload}
              ${connectWithJsonPayload}

              resolve();
          } catch(e) {
              reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
          }
      })
  }`;
}

/**
 * Return isClosed function based on the payload
 * 
 * @param {*} asyncapi 
 */
function getIsClosedFunction(asyncapi){
  let isClosedWithBinaryClient = '';
  if(containsBinaryPayload(asyncapi)){
    isClosedWithBinaryClient = `
      if (!this.binaryClient || this.binaryClient!.isClosed()){
        return true;
      }`;
  }

  let isClosedWithStringPayload = '';
  if(containsStringPayload(asyncapi)){
    isClosedWithStringPayload = `
      if (!this.stringClient || this.stringClient!.isClosed()){
        return true;
      }`;
  }

  let isClosedWithJsonPayload = '';
  if(containsJsonPayload(asyncapi)){
    isClosedWithJsonPayload = `
      if (!this.jsonClient || this.jsonClient!.isClosed()){
        return true;
      }`;
  }

  return `        
  /**
   * Returns whether or not any of the clients are closed
   */
   isClosed(){
      ${isClosedWithBinaryClient}
      ${isClosedWithStringPayload}
      ${isClosedWithJsonPayload}
      return false;
   }`;
}


/**
 * Component which returns the standard setup for the client class
 * 
 * @param {*} asyncapi 
 */
export function Standard(asyncapi) {
  return `
    private jsonClient?: Client;
    private stringClient?: Client;
    private binaryClient?: Client;
    private options?: NatsConnectionOptions;

    /**
    *
    */
    constructor() {
        super();
    }

    ${getConnectFunction(asyncapi)}
    ${getDisconnectFunction(asyncapi)}
    ${getIsClosedFunction(asyncapi)}

    private chainEvents(ns: Client){
      ns.on('permissionError', (e: NatsError) => {
          this.emit(AvailableEvents.permissionError, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
      });
      ns.on('close', (e: NatsError) => {
          this.emit(AvailableEvents.close, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
      });
      ns.on('connect', (connection: Client, serverURL: string, info: ServerInfo) => {
          this.emit(AvailableEvents.connect, connection, serverURL, info)
      });
      ns.on('connecting', (serverURL: string) => {
          this.emit(AvailableEvents.connecting, serverURL)
      });
      ns.on('disconnect', (serverURL: string) => {
          this.emit(AvailableEvents.disconnect, serverURL)
      });
      ns.on('error', (e: NatsError) => {
          this.emit(AvailableEvents.error, NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e))
      });
      ns.on('pingcount', () => {
          this.emit(AvailableEvents.pingcount)
      });
      ns.on('pingtimer', () => {
          this.emit(AvailableEvents.pingtimer)
      });
      ns.on('reconnect', (connection: Client, serverURL: string, info: ServerInfo) => {
          this.emit(AvailableEvents.reconnect, connection, serverURL, info)
      });
      ns.on('reconnecting', (serverURL: string) => {
          this.emit(AvailableEvents.reconnecting, serverURL)
      });
      ns.on('serversChanged', (e: ServersChangedEvent) => {
          this.emit(AvailableEvents.serversChanged, e)
      });
      ns.on('subscribe', (e: SubEvent) => {
          this.emit(AvailableEvents.subscribe, e)
      });
      ns.on('unsubscribe', (e: SubEvent) => {
          this.emit(AvailableEvents.unsubscribe, e)
      });
      ns.on('yield', () => {
          this.emit(AvailableEvents.yield)
      });
    }
    
    /**
    * Try to connect to the NATS server with user credentials
    */
    async connectWithUserCreds(userCreds: string, options?: NatsConnectionOptions){
      await this.connect({
      userCreds: userCreds,
      ... options
      });
    }

    /**
    * Try to connect to the NATS server with user and password
    */
    async connectWithUserPass(user: string, pass: string, options?: NatsConnectionOptions){
      await this.connect({
      user: user,
      pass: pass,
      ... options
      });
    }
    
    /**
    * Try to connect to the NATS server which has no authentication
    */
    async connectToHost(host: string, options?: NatsConnectionOptions){
      await this.connect({
      servers: [host],
      ... options
      });
    }

    /**
    * Try to connect to the NATS server with nkey authentication
    */
    async connectWithNkey(publicNkey: string, seed: string, options?: NatsConnectionOptions){
      await this.connect({
        nkey: publicNkey,
        nonceSigner: (nonce: string): Buffer => {
            const sk = fromSeed(Buffer.from(seed));
            return sk.sign(Buffer.from(nonce));
        },
        ... options
      });
    }`;
}