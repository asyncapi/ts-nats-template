import { pascalCase, camelCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from '../../utils/general';
export function Request(defaultContentType, channelName, requestMessage, replyMessage, messageDescription, channelParameters) {
  return `
    /**
     *  ${messageDescription}
     * @param requestMessage The request message to send.
     */
     public request${pascalCase(channelName)}(
       requestMessage:${getMessageType(requestMessage)} 
       ${ Object.keys(channelParameters).length && 
        `,${realizeParametersForChannel(channelParameters)}`
}
     ): Promise<${getMessageType(replyMessage)}> {
      ${
  isBinaryPayload(requestMessage.contentType(), defaultContentType) ?
    'const nc: Client = this.binaryClient!;' : ''
}

      ${
  isStringPayload(requestMessage.contentType(), defaultContentType) ?
    'const nc: Client = this.stringClient!;' : ''
}

      ${
  isJsonPayload(requestMessage.contentType(), defaultContentType) ?
    'const nc: Client = this.jsonClient!;' : ''
}
       if(nc){
         return ${camelCase(channelName)}Channel.request(
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