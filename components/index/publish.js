import { Text } from "@asyncapi/generator-react-sdk";
import { pascalCase, camelCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Publish({defaultContentType, channelName, message, messageDescription, channelParameters}){
    return `
        /**
        *  ${messageDescription}
        * @param requestMessage The message to publish.
        */
        public publishTo${pascalCase(channelName)}(
            requestMessage: ${getMessageType(message)} 
            ${
                channelParameters.length && 
                <Text>,{realizeParametersForChannel(channelParameters)}</Text>
            }
        ): Promise<void> {
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
            if(nc) {
                return ${camelCase(channelName)}Channel.publish(
                    requestMessage, 
                    nc
                    ${
                        channelParameters.length &&
                        <Text>,{realizeParametersForChannelWithoutType(channelParameters)}</Text>
                    }
                );
            }else{
                return Promise.reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));
            }
        }
    `
}