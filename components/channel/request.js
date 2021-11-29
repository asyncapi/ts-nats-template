import { realizeChannelName, getMessageType, realizeParametersForChannelWrapper, messageHasNotNullPayload, renderJSDocParameters } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a function which create a request to the given channel
 * 
 * @param {string} channelName to request to
 * @param {Message} requestMessage used to send the request
 * @param {Message} replyMessage which is receive in the reply
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function Request(channelName, requestMessage, replyMessage, channelParameters) {
  const replyMessageType = getMessageType(replyMessage);

  //Determine the request operation based on whether the message type is null
  let requestOperation = `const msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, Nats.Empty, options)`;
  if (messageHasNotNullPayload(requestMessage.payload())) {
    requestOperation = `
    let dataToSend: any = codec.encode(requestMessage.marshal());
    const msg = await nc.request(${realizeChannelName(channelParameters, channelName)}, dataToSend, options)
    `;
  }

  //Determine the request callback operation based on whether the message type is null
  let requestCallbackOperation = 'resolve(null);';
  if (messageHasNotNullPayload(replyMessage.payload())) {
    requestCallbackOperation =  `
    let receivedData = codec.decode(msg.data);
    resolve(${replyMessageType}.unmarshal(receivedData));
    `;
  }

  return `
  /**
   * Internal functionality to send request to the \`${channelName}\` channel 
   * 
   * @param requestMessage to send
   * @param nc to send request with
   * @param codec used to convert messages
   ${renderJSDocParameters(channelParameters)}
   * @param options to use for the request
   */
    export function request(
      requestMessage: ${getMessageType(requestMessage)},
      nc: Nats.NatsConnection,
      codec: Nats.Codec<any>
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: Nats.RequestOptions
      ): Promise<${replyMessageType}> {
      return new Promise(async (resolve, reject) => {
        try {
          ${requestOperation}
          ${requestCallbackOperation}
        }catch(e: any){
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
          return;
        }
      })
    }`;
}
