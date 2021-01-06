import { OnSendingData } from './OnSendingData';
import { OnReceivingData } from './OnReceivingData';
import { unwrap } from './ChannelParameterUnwrap';
import { realizeChannelName, camelCase, hasNatsBindings, messageHasNotNullPayload, getMessageType, realizeParametersForChannel} from '../../utils/general';
export function Reply(channelName, channelParameters, replyMessage, receiveMessage, params, defaultContentType) {
  let parameters = [];
  parameters = channelParameters.map(([parameterName, _]) => {
    return `${camelCase(parameterName)}Param`;
  });
  return `
    export function reply(
      onRequest : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(receiveMessage)}
        ${
  Object.keys(channelParameters).length && 
         `
         ,${realizeParametersForChannel(channelParameters, false)}
         `
}
      ) => ${params.promisifyReplyCallback.length && 'Promise<'}${getMessageType(replyMessage)}${ params.promisifyReplyCallback.length && '>'}, 
      onReplyError: (err: NatsTypescriptTemplateError) => void,
      nc: Client         
      ${ Object.keys(channelParameters).length && 
        `,${realizeParametersForChannel(channelParameters)}`
}, 
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      try {
        let subscribeOptions: SubscriptionOptions = {... options};
        
        ${
  hasNatsBindings(replyMessage) && replyMessage.bindings().nats().queue() &&
          `
          //If queue
          subscribeOptions.queue = '${replyMessage.bindings().nats().queue()}';
          `
}
        ${
  hasNatsBindings(replyMessage) && replyMessage.bindings().nats().unsubAfter() &&
          `
          //If unsubafter
          subscribeOptions.max = ${replyMessage.bindings().nats().unsubAfter()};
          `
}
  
        let subscription = await nc.subscribe(${realizeChannelName(channelParameters, channelName)}, ${params.promisifyReplyCallback.length && 'async'} (err, msg) => {
          if (err) {
            onRequest(err);
          } else {
            ${
  Object.keys(channelParameters).length ? 
    unwrap(channelName, channelParameters) : ''
}
            
            ${
  messageHasNotNullPayload(replyMessage.payload()) 
    ? `
              try{
                ${OnReceivingData(receiveMessage, defaultContentType)}
              }catch(e){
                onReplyError(e)
                return;
              }
              let message = ${params.promisifyReplyCallback.length && 'await'} onRequest(undefined, receivedData ${parameters.length > 0 && `, ${parameters.join(',')}`});
              `
    : 
    `
              let message = ${params.promisifyReplyCallback.length && 'await'} onRequest(undefined, null ${parameters.length > 0 && `, ${parameters.join(',')}`});
              `
}

            if (msg.reply) {

              ${
  messageHasNotNullPayload(replyMessage.payload()) 
    ? `
                try{
                  ${OnSendingData(replyMessage, defaultContentType)}
                }catch(e){
                  onReplyError(e)
                  return;
                }
                
                await nc.publish(msg.reply, dataToSend);
                `
    : 
    `
                await nc.publish(msg.reply, null);
                `
}
            } else {
              let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
              onReplyError(error)
              return;
            }
          }
        }, subscribeOptions);
        resolve(subscription);
      } catch (e) {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }
    `;
}