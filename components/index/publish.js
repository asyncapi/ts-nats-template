import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from '../../utils/index';
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
            ${
  isBinaryPayload(message.contentType(), defaultContentType) ? 
    'const nc: Client = this.binaryClient!;' : ''
}

            ${
  isStringPayload(message.contentType(), defaultContentType) ?
    'const nc: Client = this.stringClient!;' : ''
}

            ${
  isJsonPayload(message.contentType(), defaultContentType) ?
    'const nc: Client = this.jsonClient!;' : ''
}
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