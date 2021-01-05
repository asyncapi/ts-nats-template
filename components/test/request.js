import { Text } from "@asyncapi/generator-react-sdk";
import {generateExample} from '@asyncapi/generator-filters'
import { pascalCase, getMessageType, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Request({defaultContentType, channelName, requestMessage, replyMessage, messageDescription, channelParameters}){
    return `
    var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
    var receivedMsg: Client.{requestMessage | getMessageType} | undefined = undefined;
    ${
      channelParameters.map(([paramName, param]) => {
        return `var recieved${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`
      })
    }
    
    var replyMessage: TestClient.${getMessageType(replyMessage)} = ${generateExample(replyMessage.payload().json())};
    var requestMessage: Client.${getMessageType(requestMessage)}  = ${generateExample(requestMessage.payload().json())};
    ${
      channelParameters.map(([paramName, param]) => {
        return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`
      })
    }
    const replySubscription = await testClient.replyTo${pascalCase(channelName)}((err, msg 
        ${
          channelParameters.length && 
          <Text>
          ,{realizeParametersForChannelWithoutType(channelParameters)}
          </Text>
        }) => {
        return new Promise((resolve, reject) => {
            receivedError = err;
            receivedMsg = msg;
            ${
              channelParameters.map(([paramName, _]) => {
                return `recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))} = ${paramName}`
              })
            }
            resolve(replyMessage);
        })},
        (err) => {console.log(err)}
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
            if(replySubscription.getReceived() === 1){
                resolve();
                isReturned = true
            }
        }, 100);
    });
    var reply = await client.request${pascalCase(channelName)}(requestMessage 
      ${
        channelParameters.map(([paramName, _]) => {
          return `, ${pascalCase(paramName)}ToSend`
        })
      });
    await tryAndWaitForResponse;
    expect(reply).to.be.deep.equal(replyMessage)
    expect(receivedError).to.be.undefined;
    expect(receivedMsg).to.be.deep.equal(requestMessage);
    ${
      channelParameters.map(([paramName, _]) => {
        return `expect(recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))}).to.be.equal(${pascalCase(paramName)}ToSend);`
      })
    }
    `
}