import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWithoutType, realizeParametersForChannelWrapper, renderJSDocParameters} from '../../utils/index';
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
 * @param {string} channelName to setup reply to
 * @param {Message} replyMessage used to reply to request
 * @param {Message} receiveMessage which is received by the request 
 * @param {string} messageDescription 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 * @param {TemplateParameters} params passed template parameters 
 */
export function Reply(channelName, replyMessage, receiveMessage, messageDescription, channelParameters, params) {
  return `
  /**
   * Reply to the \`${channelName}\` channel 
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
        options?: Nats.SubscriptionOptions
      ): Promise<Nats.Subscription> {
      return new Promise(async (resolve, reject) => {
        if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
          try {
            const sub = await ${ camelCase(channelName) }Channel.reply(
              onRequest, 
              onReplyError, 
              this.nc,
              this.codec
              ${Object.keys(channelParameters).length ? `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''},
              options
            );
            if(flush){
              await this.nc!.flush();
            }
            resolve(sub);
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
