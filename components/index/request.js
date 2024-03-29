import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, realizeParametersForChannelWithoutType, renderJSDocParameters} from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * Component which returns a request to function for the client
 * 
 * @param {string} channelName to request to 
 * @param {Message} requestMessage used to send the request
 * @param {Message} replyMessage which is receive in the reply
 * @param {string} messageDescription 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 */
export function Request(channelName, requestMessage, replyMessage, messageDescription, channelParameters) {
  return `
    /**
     * Reply to the \`${channelName}\` channel 
     * 
     * ${messageDescription}
     * 
     * @param requestMessage to send
     ${renderJSDocParameters(channelParameters)}
     */
    public request${pascalCase(channelName)}(
      requestMessage:${getMessageType(requestMessage)} 
      ${realizeParametersForChannelWrapper(channelParameters)},
      options?: Nats.RequestOptions
    ): Promise<${getMessageType(replyMessage)}> {
      if(!this.isClosed() && this.nc !== undefined && this.codec !== undefined){
        return ${camelCase(channelName)}Channel.request(
          requestMessage, 
          this.nc,
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
