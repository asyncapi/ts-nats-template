import { realizeChannelName, getMessageType, realizeParametersForChannelWrapper, messageHasNullPayload, renderJSDocParameters } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a function which publishes to the given channel
 * 
 * @param {string} channelName to publish to
 * @param {Message} message which is being published
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function Publish(channelName, message, channelParameters) {
  const messageType = getMessageType(message);
  const hasNullPayload = messageHasNullPayload(message.payload());
  //Determine the publish operation based on whether the message type is null
  let publishOperation = `await nc.publish(${realizeChannelName(channelParameters, channelName)}, Nats.Empty);`;
  if (!hasNullPayload) {
    publishOperation = `
    let dataToSend : any = message.marshal();
    dataToSend = codec.encode(dataToSend);
    nc.publish(${realizeChannelName(channelParameters, channelName)}, dataToSend, options);`;
  }
  return `
  /**
   * Internal functionality to publish message to channel 
   * ${channelName}
   * 
   * @param message to publish
   * @param nc to publish with
   * @param codec used to convert messages
   ${renderJSDocParameters(channelParameters)}
   * @param options to publish with
   */
    export function publish(
      message: ${messageType},
      nc: Nats.NatsConnection,
      codec: Nats.Codec<any>
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: Nats.PublishOptions
      ): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try{
          ${publishOperation}
          resolve();
        }catch(e: any){
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
      });
    };
    `;
}
