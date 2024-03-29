import { camelCase, getMessageType, realizeParametersForChannelWrapper, renderJSDocParameters, messageHasNullPayload, realizeChannelName} from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';
import { unwrap } from './ChannelParameterUnwrap';

/**
 * Component which returns a subscribe to function for the client
 * 
 * @param {string} defaultContentType 
 * @param {string} channelName to publish to
 * @param {Message} message which is being received
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function JetstreamFetch(channelName, message, channelParameters) {
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
    onDataCallback(undefined, ${messageType}.unmarshal(receivedData) ${parameters.length > 0 && `, ${parameters.join(',')}`}, msg);
    `;
  }
  return  `
    /**
     * Internal functionality to setup jetstrema fetch on the \`${channelName}\` channel 
     * 
     * @param onDataCallback to call when messages are received
     * @param js client to fetch with
     * @param codec used to convert messages
     ${renderJSDocParameters(channelParameters)}
      */
      export function jetsStreamFetch(
        onDataCallback: (
          err ? : NatsTypescriptTemplateError,
          msg ? : ${messageType}
          ${realizeParametersForChannelWrapper(channelParameters, false)},
          jetstreamMsg?: Nats.JsMsg) => void,
        js: Nats.JetStreamClient,
        codec: Nats.Codec < any > 
        ${realizeParametersForChannelWrapper(channelParameters)},
        durable: string, options?: Partial<Nats.PullOptions>
      ) {
        const stream = ${realizeChannelName(channelParameters, channelName)};
        (async () => {
          let msgs = await js.fetch(stream, durable, options);
          for await (const msg of msgs) {
            ${unwrap(channelName, channelParameters)}

            ${whenReceivingMessage}
          }
        })();
      }
  `;
}
