import { OnSendingData } from './OnSendingData';
import { realizeChannelName, getMessageType, realizeParametersForChannelWrapper, messageHasNotNullPayload } from '../../utils/index';
export function Publish(defaultContentType, channelName, message, channelParameters) {
  return `
    export function publish(
        message: ${getMessageType(message)},
        nc: Client
        ${realizeParametersForChannelWrapper(channelParameters)}
        ): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
          try{
              ${
  messageHasNotNullPayload(message.payload())
    ?
    `
                ${OnSendingData(message, defaultContentType)}
                await nc.publish(${realizeChannelName(channelParameters, channelName)}, dataToSend);
                `
    :
    `await nc.publish(${realizeChannelName(channelParameters, channelName)}, null);`
}
            resolve();
          }catch(e){
            reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
          }
        });
    };
    `;
}