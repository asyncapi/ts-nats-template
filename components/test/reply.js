import { Text } from "@asyncapi/generator-react-sdk";
import {generateExample} from '@asyncapi/generator-filters'
import { pascalCase, getMessageType, realizeParametersForChannelWithoutType} from "../../utils/general";
export function Reply({defaultContentType, channelName, replyMessage, receiveMessage, messageDescription, channelParameters, params}){
    return `
    var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
    var receivedMsg: TestClient.${getMessageType(receiveMessage)} | undefined = undefined;

    ${
      channelParameters.map(([paramName, param]) => {
        return `var recieved${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`
      })
    }
    
    var replyMessage: Client.${getMessageType(replyMessage)} = ${generateExample(replyMessage.payload().json())};
    var receiveMessage: TestClient.${getMessageType(receiveMessage)} = ${generateExample(receiveMessage.payload().json())};
    ${
      channelParameters.map(([paramName, param]) => {
        return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`
      })
    }
    const replySubscription = await client.replyTo${pascalCase(channelName)}((err, msg 
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
    var reply = await testClient.request${pascalCase(channelName)}(receiveMessage 
        ${
          channelParameters.map(([paramName, _]) => {
            return `, ${pascalCase(paramName)}ToSend`
          })
        });
    expect(reply).to.be.deep.equal(replyMessage)
    expect(receivedError).to.be.undefined;
    expect(receivedMsg).to.be.deep.equal(receiveMessage);
    ${
      channelParameters.map(([paramName, _]) => {
        return `expect(recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))}).to.be.equal(${pascalCase(paramName)}ToSend);`
      })
    }
    `
}