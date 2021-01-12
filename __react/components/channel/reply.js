import { OnSendingData } from './OnSendingData';
import { OnReceivingData } from './OnReceivingData';
import { unwrap } from './ChannelParameterUnwrap';
import { realizeChannelName, camelCase, includeUnsubAfterForSubscription, messageHasNotNullPayload, getMessageType, realizeParametersForChannelWrapper, includeQueueForSubscription, shouldPromisfyCallbacks } from '../../utils/index';
export function Reply(defaultContentType, channelName, replyMessage, receiveMessage, channelParameters, params) {
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName, _]) => {
    return `${camelCase(parameterName)}Param`;
  });

  let whenRecievingRequest = `let message = ${shouldPromisfyCallbacks(params) ? 'await' : ''} onRequest(undefined, null ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});`;
  if (messageHasNotNullPayload(replyMessage.payload())) {
    whenRecievingRequest =  `
    try{
      ${OnReceivingData(receiveMessage, defaultContentType)}
    }catch(e){
      onReplyError(e)
      return;
    }
    let message = ${shouldPromisfyCallbacks(params) ? 'await' : ''} onRequest(undefined, receivedData ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});
    `;
  }

  let whenSendingReply = 'await nc.publish(msg.reply, null);';
  if (messageHasNotNullPayload(replyMessage.payload())) {
    whenSendingReply = `
    try{
      ${OnSendingData(replyMessage, defaultContentType)}
    }catch(e){
      onReplyError(e)
      return;
    }
    
    await nc.publish(msg.reply, dataToSend);
    `;
  }
  
  return `
    export function reply(
      onRequest : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(receiveMessage)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}
      ) => ${shouldPromisfyCallbacks(params) ? 'Promise<' : ''}${getMessageType(replyMessage)}${ shouldPromisfyCallbacks(params) ? '>' : ''}, 
      onReplyError: (err: NatsTypescriptTemplateError) => void,
      nc: Client
      ${realizeParametersForChannelWrapper(channelParameters)}, 
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      try {
        let subscribeOptions: SubscriptionOptions = {... options};
        
        ${includeQueueForSubscription(replyMessage)}
        ${includeUnsubAfterForSubscription(replyMessage)}
  
        let subscription = await nc.subscribe(${realizeChannelName(channelParameters, channelName)}, ${shouldPromisfyCallbacks(params) ? 'async' : ''} (err, msg) => {
          if (err) {
            onRequest(err);
          } else {
            ${unwrap(channelName, channelParameters)}
            
            ${whenRecievingRequest}

            if (msg.reply) {
              ${whenSendingReply}
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