import { OnSendingData } from './OnSendingData';
import { OnReceivingData } from './OnReceivingData';
import { unwrap } from './ChannelParameterUnwrap';
import { realizeChannelName, camelCase, includeUnsubAfterForSubscription, messageHasNotNullPayload, getMessageType, realizeParametersForChannelWrapper, includeQueueForSubscription, shouldPromisifyCallbacks, renderJSDocParameters } from '../../utils/index';

/**
 * Component which returns a function which sets up a reply for a given channel
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to reply to
 * @param {*} replyMessage which is being send as a reply
 * @param {*} receiveMessage which is being received
 * @param {{[key: string]: ChannelParameter}} channelParameters parameters to the channel
 * @param {*} params template parameters
 */
export function Reply(defaultContentType, channelName, replyMessage, receiveMessage, channelParameters, params, operation) {
  //Create an array of all the parameter names
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName, _]) => {
    return `${camelCase(parameterName)}Param`;
  });

  //Determine the receiving process based on whether the payload type is null
  let receivingOperation = `let message = ${shouldPromisifyCallbacks(params) ? 'await' : ''} onRequest(undefined, null ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});`;
  if (messageHasNotNullPayload(receiveMessage.payload())) {
    receivingOperation =  `
    let receivedData : any = msg.data;
    try{
      ${OnReceivingData(receiveMessage, defaultContentType)}
    }catch(e){
      onReplyError(e)
      return;
    }
    let message = ${shouldPromisifyCallbacks(params) ? 'await' : ''} onRequest(undefined, receivedData ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});
    `;
  }

  //Determine the reply process based on whether the payload type is null
  let replyOperation = 'await client.publish(msg.reply, null);';
  if (messageHasNotNullPayload(replyMessage.payload())) {
    replyOperation = `
    let dataToSend : any = message;
    try{
      ${OnSendingData(replyMessage, defaultContentType)}
    }catch(e){
      onReplyError(e)
      return;
    }
    await client.publish(msg.reply, dataToSend);
    `;
  }
  
  return `
  /**
   * Internal functionality to setup reply to channel 
   * ${channelName}
   * 
   * @param onRequest called when request is received
   * @param onReplyError called when it was not possible to send the reply
   * @param client to setup reply with
   ${renderJSDocParameters(channelParameters)}
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
    export function reply(
      onRequest : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(receiveMessage)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}
      ) => ${shouldPromisifyCallbacks(params) ? 'Promise<' : ''}${getMessageType(replyMessage)}${ shouldPromisifyCallbacks(params) ? '>' : ''}, 
      onReplyError: (err: NatsTypescriptTemplateError) => void,
      client: Client
      ${realizeParametersForChannelWrapper(channelParameters)}, 
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      try {
        let subscribeOptions: SubscriptionOptions = {... options};
        
        ${includeQueueForSubscription(operation)}
        ${includeUnsubAfterForSubscription(operation)}
  
        let subscription = await client.subscribe(${realizeChannelName(channelParameters, channelName)}, ${shouldPromisifyCallbacks(params) ? 'async' : ''} (err, msg) => {
          if (err) {
            onRequest(err);
          } else {
            ${unwrap(channelName, channelParameters)}
            
            ${receivingOperation}

            if (msg.reply) {
              ${replyOperation}
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
