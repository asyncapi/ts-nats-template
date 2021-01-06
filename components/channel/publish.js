import { OnSendingData } from './OnSendingData';
import { realizeChannelName, getMessageType, realizeParametersForChannel, messageHasNotNullPayload } from '../../utils/general';
export function Publish(channelName, channelParameters, message, defaultContentType) {
  return `
    export function publish(
        message: ${getMessageType(message)},
        nc: Client
        ${Object.keys(channelParameters).length ?
    `
         ,${realizeParametersForChannel(channelParameters)}
         ` : ''
}
        ): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
          try{
              ${messageHasNotNullPayload(message.payload())
    ?
    `
                ${OnSendingData(message, defaultContentType)}}
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