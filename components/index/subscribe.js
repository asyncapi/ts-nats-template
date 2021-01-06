import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from '../../utils/index';
export function Subscribe(defaultContentType, channelName, message, messageDescription, channelParameters) {
  return  `
  /**
  *  ${messageDescription}
  * @param onDataCallback Called when message received.
  */
  public subscribeTo${pascalCase(channelName)}(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(message)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}) => void
      ${realizeParametersForChannelWrapper(channelParameters)},
      flush?: boolean,
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
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

      if(nc){
        try{
          const sub = await ${camelCase(channelName)}Channel.subscribe(
            onDataCallback, nc
            ${
  Object.keys(channelParameters).length ?
    `
              ,${realizeParametersForChannelWithoutType(channelParameters)}
              ` : ''
}, 
            options
          );
          if(flush){
            this.jsonClient!.flush(() => {
              resolve(sub);
            });
          }else{
            resolve(sub);
          }
        }catch(e){
          reject(e);
        }
      }else{
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
      }
    });
  }
  `;
}