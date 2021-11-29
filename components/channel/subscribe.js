import { realizeChannelName, camelCase, getMessageType, includeUnsubAfterForSubscription, messageHasNullPayload, realizeParametersForChannelWrapper, includeQueueForSubscription, renderJSDocParameters} from '../../utils/index';
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
export function Subscribe(channelName, message, channelParameters, operation) {
  const messageType = getMessageType(message);
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName]) => {
    return `${camelCase(parameterName)}Param`;
  });
  const hasNullPayload = messageHasNullPayload(message.payload());

  //Determine the callback process when receiving messages.
  //If the message payload is null no hooks are called to process the received data.
  let whenReceivingMessage = `onDataCallback(undefined, null ${parameters.length > 0 && `, ${parameters.join(',')}`});`;
  if (!hasNullPayload) {
    whenReceivingMessage =  `
    let receivedData: any = codec.decode(msg.data);
    onDataCallback(undefined, ${messageType}.unmarshal(receivedData) ${parameters.length > 0 && `, ${parameters.join(',')}`});
    `;
  }
  
  return `
  
  /**
   * Internal functionality to setup subscription on the \`${channelName}\` channel 
   * 
   * @param onDataCallback to call when messages are received
   * @param nc to subscribe with
   * @param codec used to convert messages
   ${renderJSDocParameters(channelParameters)}
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
    export function subscribe(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${messageType}
        ${realizeParametersForChannelWrapper(channelParameters, false)}) => void, 
      nc: Nats.NatsConnection, 
      codec: Nats.Codec<any>
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: Nats.SubscriptionOptions
    ): Promise<Nats.Subscription> {
    return new Promise(async (resolve, reject) => {
      let subscribeOptions: Nats.SubscriptionOptions = {... options};
      ${includeQueueForSubscription(operation)}
      ${includeUnsubAfterForSubscription(operation)}

      try{
        let subscription = nc.subscribe(${realizeChannelName(channelParameters, channelName)}, subscribeOptions); 
        (async () => {
          for await (const msg of subscription) {
            ${unwrap(channelName, channelParameters)}

            ${whenReceivingMessage}
          }
          console.log("subscription closed");
        })();
        resolve(subscription);
      }catch(e: any){
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }  
    `;
}
