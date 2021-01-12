import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, getClientToUse, realizeParametersForChannelWithoutType} from '../../utils/index';

/**
 * Component which returns a subscribe to function for the client
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to publish to
 * @param {*} message received
 * @param {*} messageDescription 
 * @param {*} channelParameters parameters to the channel 
 */
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
      ${getClientToUse(message, defaultContentType)}

      if(nc){
        try{
          const sub = await ${camelCase(channelName)}Channel.subscribe(
            onDataCallback, nc
            ${Object.keys(channelParameters).length ? ` ,${realizeParametersForChannelWithoutType(channelParameters)}` : ''}, 
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