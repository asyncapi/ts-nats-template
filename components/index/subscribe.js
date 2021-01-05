import { Text } from "@asyncapi/generator-react-sdk";
import { pascalCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Subscribe({defaultContentType, channelName, message, messageDescription, channelParameters}){
    return `
  /**
  *  ${messageDescription}
  * @param onDataCallback Called when message received.
  */
  public subscribeTo${pascalCase(channelName)}(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(message)}
        ${ 
          channelParameters.length && 
          <Text>, {realizeParametersForChannel(channelParameters, false)}</Text>
        }) => void
      ${
        channelParameters.length && 
        <Text>
        ,{realizeParametersForChannel(channelParameters)}
        </Text>
      },
      flush?: boolean,
      options?: SubscriptionOptions
    ): Promise<Subscription> {
    return new Promise(async (resolve, reject) => {
      ${
          isBinaryPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.binaryClient!;</Text>
      }

      ${
          isStringPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.stringClient!;</Text>
      }

      ${
          isJsonPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.jsonClient!;</Text>
      }

      if(nc){
        try{
          const sub = await ${camelCase(channelName)}Channel.subscribe(
            onDataCallback, nc
            ${
              channelParameters.length && 
              <Text>
              ,{realizeParametersForChannelWithoutType(channelParameters)}
              </Text>
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
  `
}