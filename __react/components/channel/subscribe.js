import { OnReceivingData } from './OnReceivingData';
import { realizeChannelName, camelCase, getMessageType, includeUnsubAfterForSubscription, messageHasNotNullPayload, realizeParametersForChannelWrapper, includeQueueForSubscription} from '../../utils/index';
import { unwrap } from './ChannelParameterUnwrap';
export function Subscribe(defaultContentType, channelName, message, channelParameters) {
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName]) => {
    return `${camelCase(parameterName)}Param`;
  });
  let whenRecievingMessage = `onDataCallback(undefined, null ${parameters.length > 0 && `, ${parameters.join(',')}`});`;
  if (messageHasNotNullPayload(message.payload())) {
    whenRecievingMessage =  `
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
    export function subscribe(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(message)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}) => void, 
      nc: Client
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      let subscribeOptions: SubscriptionOptions = {... options};
      ${includeQueueForSubscription(message)}
      ${includeUnsubAfterForSubscription(message)}

      try{
        let subscription = await nc.subscribe(${realizeChannelName(channelParameters, channelName)}, (err, msg) => {
          if(err){
            onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
          }else{
            ${unwrap(channelName, channelParameters)}

            ${whenRecievingMessage}
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