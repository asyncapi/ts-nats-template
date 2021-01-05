import { Text } from "@asyncapi/generator-react-sdk";
import {generateExample} from '@asyncapi/generator-filters'
import { pascalCase, getMessageType, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Subscribe({defaultContentType, channelName, message, messageDescription, channelParameters}){
    return `

    var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
    var receivedMsg: Client.${getMessageType(message)} | undefined = undefined;
    ${
      channelParameters.map(([paramName, param]) => {
        return `var recieved${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`
      })
    }
    
    var publishMessage: Client.${getMessageType(message)} = ${generateExample(message.payload().json())};
    ${
      channelParameters.map(([paramName, param]) => {
        return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`
      })
    }
    const subscription = await client.subscribeTo${pascalCase(channelName)}((err, msg 
          ${
            channelParameters.length && 
            <Text>
            ,{realizeParametersForChannelWithoutType(channelParameters)}
            </Text>
          }) => {
            receivedError = err;
            receivedMsg = msg;
            ${
              channelParameters.map(([paramName, _]) => {
                return `recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))} = ${paramName}`
              })
            }
        }
        ${
          channelParameters.map(([paramName, _]) => {
            return `, ${pascalCase(paramName)}ToSend`
          })
        },
        true
    );
    const tryAndWaitForResponse = new Promise((resolve, reject) => {
        let isReturned = false;
        setTimeout(() => {
            if(!isReturned){
                reject(new Error("Timeout"));
            }
        }, 3000)
        setInterval(async () => {
            if(subscription.getReceived() === 1){
                resolve();
                isReturned = true
            }
        }, 100);
    });
    await testClient.publishTo${pascalCase(channelName)}(publishMessage 
      ${
        channelParameters.map(([paramName, _]) => {
          return `, ${pascalCase(paramName)}ToSend`
        })
      });
    await tryAndWaitForResponse;
    expect(receivedError).to.be.undefined;
    ${
      channelParameters.map(([paramName, _]) => {
        return `expect(recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))}).to.be.equal(${pascalCase(paramName)}ToSend);`
      })
    }
    `
}