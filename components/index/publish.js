import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, realizeParametersForChannelWithoutType, getClientToUse} from '../../utils/index';
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
                    ${
  Object.keys(channelParameters).length ?
    `,${realizeParametersForChannelWithoutType(channelParameters)}` : ''
}
                );
            }else{
                return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
            }
        }
    `;
}