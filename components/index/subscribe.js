import { pascalCase, camelCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from '../../utils/general';
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
        ${ 
  Object.keys(channelParameters).length ? 
    `, ${realizeParametersForChannel(channelParameters, false)}` : ''
}) => void
      ${
  Object.keys(channelParameters).length ? 
    `
        ,${realizeParametersForChannel(channelParameters)}
        ` : ''
},
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