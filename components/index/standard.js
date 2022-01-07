import { containsStringPayload, containsJsonPayload, camelCase, pascalCase, messageHasNullPayload, getSchemaFileName} from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocument } from '@asyncapi/parser';

/**
 * Return disconnect function based on the payload
 */
function getDisconnectFunction() {
  return `        
    /**
     * Disconnect all clients from the server
     */
    async disconnect(){
      if (!this.isClosed() && this.nc !== undefined) {
        await this.nc.drain();
      }
    }`;
}

/**
 * Return connect function based on the payload
 * 
 * @param {AsyncAPIDocument} asyncapi 
 */
function getConnectFunction(asyncapi) {
  let codec = '';
  if (containsJsonPayload(asyncapi)) {
    codec = 'this.codec = Nats.JSONCodec();';
  } else if (containsStringPayload(asyncapi)) {
    codec = 'this.codec = Nats.StringCodec();';
  } else {
    codec = 'reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, \'Unrecognized content type, custom codec expected, please provide one.\'))';
  }
  return `
  /**
  * Try to connect to the NATS server with the different payloads.
  * @param options to use, payload is omitted if sat in the AsyncAPI document.
  */
  connect(options: Nats.ConnectionOptions, codec?: Nats.Codec<any>): Promise<void>{
    return new Promise(async (resolve: () => void, reject: (error: any) => void) => {
      if (!this.isClosed()) {
        return reject('Client is still connected, please close it first.');
      }
      this.options = options;

      if (codec) {
        this.codec = codec;
      } else { 
        ${codec}
      }

      try {
        this.nc = await Nats.connect(this.options);
        resolve();
      } catch(e: any) {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }`;
}

/**
 * Return isClosed function based on the payload
 */
function getIsClosedFunction() {
  return `
  /**
   * Returns whether or not any of the clients are closed
   */
  isClosed(){
    if (!this.nc || this.nc!.isClosed()) {
      return true;
    }
    return false;
  }`;
}
/**
 * Render all the connect function based on the AsyncAPI servers 
 */
function renderConnectServerFunctions(servers) {
  const serverWrapperFunctions = [];
  for (const [serverName, server] of Object.entries(servers || {})) {
    serverWrapperFunctions.push(`
/**
 * Connects the client to the AsyncAPI server called ${serverName}.
 * ${server.description() || ''}
 */
async connectTo${pascalCase(serverName)}(codec?: Nats.Codec<any>){ await this.connect({ servers: ["${server.url()}"] }, codec); }`);
  }
  return serverWrapperFunctions;
}
/**
 * Component which returns the standard setup for the client class
 * 
 * @param {AsyncAPIDocument} asyncapi 
 */
export function getStandardClassCode(asyncapi) {
  return `
  private nc?: Nats.NatsConnection;
  private codec ?: Nats.Codec<any>;
  private options?: Nats.ConnectionOptions;
  
  ${getConnectFunction(asyncapi)}
  ${getDisconnectFunction()}
  ${getIsClosedFunction()}
    
  /**
   * Try to connect to the NATS server with user credentials
   *
   * @param userCreds to use
   * @param options to connect with
   */
   async connectWithUserCreds(userCreds: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>){
    await this.connect({
      user: userCreds,
      ... options
    }, codec);
   }
 
  /**
   * Try to connect to the NATS server with user and password
   * 
   * @param user username to use
   * @param pass password to use
   * @param options to connect with
   */
  async connectWithUserPass(user: string, pass: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>){
    await this.connect({
      user: user,
      pass: pass,
      ... options
    }, codec);
  }

  /**
   * Try to connect to the NATS server which has no authentication
   
    * @param host to connect to
    * @param options to connect with
    */
  async connectToHost(host: string, options?: Nats.ConnectionOptions, codec?: Nats.Codec<any>){
    await this.connect({
      servers: [host],
      ... options
    }, codec);
  }    
  ${renderConnectServerFunctions(asyncapi.servers()).join('\n')}`;
}

/**
 * Get all the standard import and exports
 *
 * @param {AsyncAPIDocument} asyncapi 
 * @param {string} pathToRoot 
 * @param {string} channelPath 
 */
export function getStandardHeaderCode(asyncapi, pathToRoot, channelPath) {
  const channels = asyncapi.channels();
  //Import the channel code and re-export them
  const imports = [];
  const exports = [];
  for (const [channelName] of Object.entries(channels)) {
    const camelCaseChannelName = camelCase(channelName);
    imports.push(`import * as ${camelCaseChannelName}Channel from "${channelPath}/${pascalCase(channelName)}";`);
    exports.push(`export {${camelCaseChannelName}Channel};`);
  }

  //Import the messages and re-export them
  for (const [, message] of asyncapi.allMessages()) {
    const hasNullPayload = messageHasNullPayload(message.payload());
    if (!hasNullPayload) {
      const schemaName = getSchemaFileName(message.payload().uid());
      imports.push(`import ${schemaName} from "${pathToRoot}/models/${schemaName}";`);
      exports.push(`export {${schemaName}};`);
    }
  }
  return `
import {ErrorCode, NatsTypescriptTemplateError} from '${pathToRoot}/NatsTypescriptTemplateError';
import * as Nats from 'nats';

${imports.join('\n')}

${exports.join('\n')}`;
}
