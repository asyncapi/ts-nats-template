import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, realizeParametersForChannelWithoutType, renderJSDocParameters } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a publish to function for the client
 * 
 * @param {string} defaultContentType 
 * @param {string} channelName to publish to
 * @param {Message} message which is being published
 * @param {string} messageDescription 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function JetstreamPublish(channelName, message, messageDescription, channelParameters) {
  return `
  /**
   * Publish to the \`${channelName}\` jetstream channel 
   * 
   * ${messageDescription}
   * 
   * @param message to publish
   ${renderJSDocParameters(channelParameters)}
   */
  public jetStreamPublishTo${pascalCase(channelName)}(
    message: ${getMessageType(message)} 
    ${realizeParametersForChannelWrapper(channelParameters)},
    options?: Nats.PublishOptions
  ): Promise<void> {
    if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined && this.js !== undefined) {
      return ${camelCase(channelName)}Channel.jetStreamPublish(
        message, 
        this.js,
        this.codec
        ${Object.keys(channelParameters).length ? `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''},
        options
      );
    }else{
      return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
    }
  }
  `;
}
