import { OnReceivingData } from './OnReceivingData';
import { realizeChannelName, camelCase, getMessageType, hasNatsBindings, messageHasNotNullPayload, realizeParametersForChannelWrapper} from '../../utils/index';
import { unwrap } from './ChannelParameterUnwrap';
export function Subscribe(defaultContentType, channelName, message, channelParameters) {
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName]) => {
    return `${camelCase(parameterName)}Param`;
  });
  
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
      ${
  hasNatsBindings(message) && message.bindings().nats().queue() &&
        `
        //If queue
        subscribeOptions.queue = '${message.bindings().nats().queue()}';
        `
}
      ${
  hasNatsBindings(message) && message.bindings().nats().unsubAfter() &&
        `
        //If unsubafter
        subscribeOptions.max = ${message.bindings().nats().unsubAfter()};
        `
}
      try{
        let subscription = await nc.subscribe(${realizeChannelName(channelParameters, channelName)}, (err, msg) => {
          if(err){
            onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
          }else{
            ${
  Object.keys(channelParameters).length &&
              unwrap(channelName, channelParameters)
}

            ${
  messageHasNotNullPayload(message.payload()) 
    ? `
              try{
                ${OnReceivingData(message, defaultContentType)}
              }catch(e){
                onDataCallback(e)
                return;
              }
              onDataCallback(undefined, receivedData ${parameters.length > 0 && `, ${parameters.join(',')}`});
              `
    : 
    `
              onDataCallback(undefined, null ${parameters.length > 0 && `, ${parameters.join(',')}`});
              `
}
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