import { OnSendingData } from './OnSendingData';
import { realizeChannelName, getMessageType, realizeParametersForChannelWrapper, messageHasNotNullPayload } from '../../utils/index';

/**
 * Component which returns a function which subscribes to the given channel
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to publish to
 * @param {*} message which is being published
 * @param {*} channelParameters parameters to the channel
 */
export function Publish(defaultContentType, channelName, message, channelParameters) {

  //Determine the publish operation based on whether the message type is null
  let publishOperation = `await nc.publish(${realizeChannelName(channelParameters, channelName)}, null);`
  if(messageHasNotNullPayload(message.payload())){
    publishOperation = `
      ${OnSendingData(message, defaultContentType)}
      await nc.publish(${realizeChannelName(channelParameters, channelName)}, dataToSend);
    `;
  }
  return `
    export function publish(
      message: ${getMessageType(message)},
      nc: Client
      ${realizeParametersForChannelWrapper(channelParameters)}
      ): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try{
          let dataToSend : any = message;
          ${publishOperation}
          resolve();
        }catch(e){
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
      });
    };
    `;
}