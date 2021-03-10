import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWithoutType, realizeParametersForChannelWrapper, getClientToUse, renderJSDocParameters} from '../../utils/index';
/**
 * Component which returns a reply to function for the client
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to setup reply to
 * @param {*} replyMessage which is being received
 * @param {*} receiveMessage which is to be returned 
 * @param {*} messageDescription 
 * @param {*} channelParameters parameters to the channel
 * @param {*} params passed template parameters 
 */
export function Reply(defaultContentType, channelName, replyMessage, receiveMessage, messageDescription, channelParameters, params) {
  return `
  /**
   * Reply to the `${channelName}` channel 
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
