import { Text } from "@asyncapi/generator-react-sdk";
import { pascalCase, camelCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Request({defaultContentType, channelName, requestMessage, replyMessage, messageDescription, channelParameters}){
    return `
    /**
     *  ${messageDescription}
     * @param requestMessage The request message to send.
     */
     public request${pascalCase(channelName)}(
       requestMessage:${getMessageType(requestMessage)} 
       ${ channelParameters.length && 
        `,${realizeParametersForChannel(channelParameters)}`
       }
     ): Promise<${getMessageType(replyMessage)}> {
      ${
          isBinaryPayload(receiveMessage.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.binaryClient!;</Text>
      }

      ${
          isStringPayload(receiveMessage.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.stringClient!;</Text>
      }

      ${
          isJsonPayload(receiveMessage.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.jsonClient!;</Text>
      }
       if(nc){
         return ${camelCase(channelName)}Channel.request(
           requestMessage, 
           nc
           ${
            channelParameters.length && 
            `,${realizeParametersForChannelWithoutType(channelParameters)}`
           }
         );
       }else{
         return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
       }
     }
    `
}