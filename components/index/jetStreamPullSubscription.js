import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, realizeParametersForChannelWithoutType, renderJSDocParameters} from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a subscribe to function for the client
 * 
 * @param {string} defaultContentType 
 * @param {string} channelName to publish to
 * @param {Message} message which is being received
 * @param {string} messageDescription 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function JetstreamPullSubscribe(channelName, message, messageDescription, channelParameters) {
  return  `
  /**
    * Push subscription to the \`${channelName}\`
    * 
    * ${messageDescription}
    * 
    * @param onDataCallback to call when messages are received
    ${renderJSDocParameters(channelParameters)}
    * @param flush ensure client is force flushed after subscribing
    * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
    */
    public jetStreamPullSubscribeTo${pascalCase(channelName)}(
      onDataCallback: (
        err ? : NatsTypescriptTemplateError,
        msg?: ${getMessageType(message)}
        ${realizeParametersForChannelWrapper(channelParameters, false)},
        jetstreamMsg?: Nats.JsMsg) => void
      ${realizeParametersForChannelWrapper(channelParameters)},
      options: Nats.ConsumerOptsBuilder | Partial<Nats.ConsumerOpts>
    ): Promise<Nats.JetStreamPullSubscription> {
      return new Promise(async (resolve, reject) => {
        if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined && this.js !== undefined) {
          try {
            const sub = ${camelCase(channelName)}Channel.jetStreamPullSubscribe(
              onDataCallback,
              this.js,
              this.codec 
              ${Object.keys(channelParameters).length ? ` ,${realizeParametersForChannelWithoutType(channelParameters)}` : ''},
              options
            );
            resolve(sub);
          } catch (e: any) {
            reject(e);
          }
        } else {
          reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
        }
      });
    }
  `;
}
