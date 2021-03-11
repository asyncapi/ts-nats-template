import { OnReceivingData } from './OnReceivingData';
import { realizeChannelName, camelCase, getMessageType, includeUnsubAfterForSubscription, messageHasNotNullPayload, realizeParametersForChannelWrapper, includeQueueForSubscription, renderJSDocParameters} from '../../utils/index';
import { unwrap } from './ChannelParameterUnwrap';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a function which subscribes to the given channel
 * 
 * @param {string} defaultContentType 
 * @param {string} channelName to subscribe to
 * @param {Message} message which is being received
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function Subscribe(defaultContentType, channelName, message, channelParameters, operation) {
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName]) => {
    return `${camelCase(parameterName)}Param`;
  });

  //Determine the callback process when receiving messages.
  //If the message payload is null no hooks are called to process the received data.
  let whenReceivingMessage = `onDataCallback(undefined, null ${parameters.length > 0 && `, ${parameters.join(',')}`});`;
  if (messageHasNotNullPayload(message.payload())) {
    whenReceivingMessage =  `
    let receivedData : any = msg.data;
    try{
      ${OnReceivingData(message, defaultContentType)}
    }catch(e){
      onDataCallback(e)
      return;
    }
    onDataCallback(undefined, receivedData ${parameters.length > 0 && `, ${parameters.join(',')}`});
    `;
  }
  
  return `
  
  /**
   * Internal functionality to setup subscription on the \`${channelName}\` channel 
   * 
   * @param onDataCallback to call when messages are received
   * @param client to subscribe with
   ${renderJSDocParameters(channelParameters)}
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
    export function subscribe(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(message)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}) => void, 
      client: Client
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      let subscribeOptions: SubscriptionOptions = {... options};
      ${includeQueueForSubscription(operation)}
      ${includeUnsubAfterForSubscription(operation)}

      try{
        let subscription = await client.subscribe(${realizeChannelName(channelParameters, channelName)}, (err, msg) => {
          if(err){
            onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
          }else{
            ${unwrap(channelName, channelParameters)}

            ${whenReceivingMessage}
          }
        }, subscribeOptions);
        resolve(subscription);
      }catch(e){
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }  
    `;
}
