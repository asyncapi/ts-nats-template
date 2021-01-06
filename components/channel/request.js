import { OnSendingData } from './OnSendingData';
import { OnReceivingData } from './OnReceivingData';
import { realizeChannelName, getMessageType, realizeParametersForChannel, hasNatsBindings, messageHasNotNullPayload, } from '../../utils/general';
export function Request(channelName, channelParameters, requestMessage, receiveMessage, defaultContentType) {
  return `
    export function request(
      message: ${getMessageType(requestMessage)},
      nc: Client
      ${
  Object.keys(channelParameters).length && 
        `
        ,${realizeParametersForChannel(channelParameters)}
        `
}
      ): Promise<${getMessageType(receiveMessage)}> {
      return new Promise(async (resolve, reject) => {
        var timeout = undefined;
        ${
  hasNatsBindings(requestMessage) && requestMessage.bindings().nats().requestReply() && requestMessage.bindings().nats().requestReply().timeout() &&
          `timeout = '${requestMessage.bindings().nats().requestReply().timeout()}';`
}
        let msg;
        try {

          ${
  messageHasNotNullPayload(requestMessage.payload()) 
    ? 
    `
            ${OnSendingData(requestMessage, defaultContentType)}
            msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, timeout, dataToSend)
            `
    : 
    `msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, timeout, null)`
}
        }catch(e){
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
          return;
        }
        ${
  messageHasNotNullPayload(receiveMessage.payload())
    ? `
          try{
            ${OnReceivingData(receiveMessage, defaultContentType)}
          }catch(e){
            reject(e)
            return;
          }
          resolve(receivedData);
          `
    : 'resolve(null);'
}
      })
    }
    `;
}