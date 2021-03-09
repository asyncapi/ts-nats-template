import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWithoutType, realizeParametersForChannelWrapper, getClientToUse, renderParameterComments, renderJSDocParameters} from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 * @property {boolean} promisifyReplyCallback - whether or not reply callbacks should be promisify.
 */

/**
 * Component which returns a reply to function for the client
 * 
 * @param {string} defaultContentType 
 * @param {string} channelName to setup reply to
 * @param {Message} replyMessage which is being received
 * @param {Message} receiveMessage which is to be returned 
 * @param {string} messageDescription 
 * @param {{[key: string]: ChannelParameter}} channelParameters parameters to the channel
 * @param {TemplateParameters} params passed template parameters 
 */
export function Reply(defaultContentType, channelName, replyMessage, receiveMessage, messageDescription, channelParameters, params) {
  return `
  /**
   * Reply to channel 
   * ${channelName}
   * 
   * ${messageDescription}
   * 
   * @param onRequest called when request is received
   * @param onReplyError called when it was not possible to send the reply
   ${renderJSDocParameters(channelParameters)}
   * @param flush ensure client is force flushed after subscribing
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
    public replyTo${pascalCase(channelName)}(
        onRequest : (
          err?: NatsTypescriptTemplateError, 
          msg?: ${getMessageType(receiveMessage)}
          ${realizeParametersForChannelWrapper(channelParameters, false)}
        ) => ${params.promisifyReplyCallback.length && 'Promise<'}${getMessageType(replyMessage)}${ params.promisifyReplyCallback.length && '>'}, 
        onReplyError : (err: NatsTypescriptTemplateError) => void 
        ${realizeParametersForChannelWrapper(channelParameters)}, 
        flush?: boolean,
        options?: SubscriptionOptions
      ): Promise<Subscription> {
      return new Promise(async (resolve, reject) => {
        ${getClientToUse(receiveMessage, defaultContentType)}
        if (nc) {
          try {
            const sub = await ${ camelCase(channelName) }Channel.reply(
              onRequest, 
              onReplyError, 
              nc
              ${Object.keys(channelParameters).length ? `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''},
              options
            );
            if(flush){
              this.jsonClient!.flush(() => {
                resolve(sub);
              });
            }else{
              resolve(sub);
            }
          } catch (e) {
            reject(e);
          }
        } else {
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
        }
      });
    }
  `;
}
