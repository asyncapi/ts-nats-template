import { OnSendingData } from './OnSendingData';
import { OnReceivingData } from './OnReceivingData';
import { realizeChannelName, getMessageType, realizeParametersForChannelWrapper, messageHasNotNullPayload } from '../../utils/index';

/**
 * Component which returns a function which create a request to the given channel
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to request to
 * @param {*} requestMessage which should be send
 * @param {*} receiveMessage which is received after request
 * @param {*} channelParameters parameters to the channel
 */
export function Request(defaultContentType, channelName, requestMessage, receiveMessage, channelParameters) {
  //Include timeout if specified in the document
  let includeTimeout =  '';
  const natsBindings = requestMessage.bindings('nats');
  if (requestMessage.hasBinding('nats') && 
      natsBindings.requestReply && 
      natsBindings.requestReply.timeout) {
    includeTimeout = `timeout = '${natsBindings.requestReply.timeout}';`;
  }

  //Determine the request operation based on whether the message type is null
  let requestOperation = `msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, timeout, null)`;
  if (messageHasNotNullPayload(requestMessage.payload())) {
    requestOperation = `
    ${OnSendingData(requestMessage, defaultContentType)}
    msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, timeout, dataToSend)
    `;
  }

  //Determine the request callback operation based on whether the message type is null
  let requestCallbackOperation = 'resolve(null);';
  if (messageHasNotNullPayload(receiveMessage.payload())) {
    requestCallbackOperation =  `
    let receivedData : any = msg.data;
    try{
      ${OnReceivingData(receiveMessage, defaultContentType)}
    }catch(e){
      reject(e)
      return;
    }
    resolve(receivedData);
    `;
  }

  return `
    export function request(
      message: ${getMessageType(requestMessage)},
      nc: Client
      ${realizeParametersForChannelWrapper(channelParameters)}
      ): Promise<${getMessageType(receiveMessage)}> {
      return new Promise(async (resolve, reject) => {
        let timeout = undefined;
        ${includeTimeout}
        let msg;
        let dataToSend : any = message;
        try {
          ${requestOperation}
        }catch(e){
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
          return;
        }
        ${requestCallbackOperation}
      })
    }
    `;
}
