import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, realizeParametersForChannelWithoutType, getClientToUse } from '../../utils/index';

/**
 * Component which returns a publish to function for the client
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to publish to
 * @param {*} message to publish
 * @param {*} messageDescription 
 * @param {*} channelParameters parameters to the channel
 */
export function Publish(defaultContentType, channelName, message, messageDescription, channelParameters) {
  return `
    /**
    *  ${messageDescription}
    * @param requestMessage The message to publish.
    */
    public publishTo${pascalCase(channelName)}(
      requestMessage: ${getMessageType(message)} 
      ${realizeParametersForChannelWrapper(channelParameters)}
    ): Promise<void> {
      ${getClientToUse(message, defaultContentType)}

      if(nc) {
        return ${camelCase(channelName)}Channel.publish(
          requestMessage, 
          nc
          ${Object.keys(channelParameters).length ? `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''}
        );
      }else{
        return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
      }
    }
  `;
}