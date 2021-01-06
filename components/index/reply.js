import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWithoutType, realizeParametersForChannelWrapper, getClientToUse} from '../../utils/index';
export function Reply(defaultContentType, channelName, replyMessage, receiveMessage, messageDescription, channelParameters, params) {
  return `
    /**
     *  ${messageDescription}
     * @param onRequest Called when request received.
     * @param onReplyError Called when it was not possible to send the reply.
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
               ${
  Object.keys(channelParameters).length ?
    `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''
},
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