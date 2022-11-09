import { realizeChannelName, camelCase, getMessageType, messageHasNullPayload, realizeParametersForChannelWrapper, renderJSDocParameters} from '../../utils/index';
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
export function JetstreamPullSubscription(channelName, message, channelParameters) {
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
   * Internal functionality to setup jetstream pull subscription on the \`${channelName}\` channel 
   * 
   * @param onDataCallback to call when messages are received
   * @param nc to subscribe with
   * @param codec used to convert messages
   ${renderJSDocParameters(channelParameters)}
   */
  export function jetStreamPullSubscribe(
    onDataCallback: (
      err ? : NatsTypescriptTemplateError,
      msg?: ${messageType}
      ${realizeParametersForChannelWrapper(channelParameters, false)},
      jetstreamMsg?: Nats.JsMsg) => void,
    js: Nats.JetStreamClient,
    codec: Nats.Codec < any > 
    ${realizeParametersForChannelWrapper(channelParameters)},
    options: Nats.ConsumerOptsBuilder | Partial<Nats.ConsumerOpts>
  ): Promise < Nats.JetStreamPullSubscription > {
    return new Promise(async (resolve, reject) => {
      try {
        const subscription = await js.pullSubscribe(${realizeChannelName(channelParameters, channelName)}, options);
  
        (async () => {
          for await (const msg of subscription) {
            ${unwrap(channelName, channelParameters)}

            ${whenReceivingMessage}
          }
        })();
        resolve(subscription);
      } catch (e: any) {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }
    `;
}
