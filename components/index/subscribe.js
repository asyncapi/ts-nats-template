import { pascalCase, camelCase, getMessageType, realizeParametersForChannelWrapper, getClientToUse, realizeParametersForChannelWithoutType, renderJSDocParameters} from '../../utils/index';

/**
 * Component which returns a subscribe to function for the client
 * 
 * @param {*} defaultContentType 
 * @param {*} channelName to publish to
 * @param {*} message received
 * @param {*} messageDescription 
 * @param {{[key: string]: ChannelParameter}} channelParameters parameters to the channel
 */
export function Subscribe(defaultContentType, channelName, message, messageDescription, channelParameters) {
  return  `
  /**
    * Subscribe to
    * ${channelName}
    * 
    * ${messageDescription}
    * 
    * @param onDataCallback to call when messages are received
    ${renderJSDocParameters(channelParameters)}
    * @param flush ensure client is force flushed after subscribing
    * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
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
