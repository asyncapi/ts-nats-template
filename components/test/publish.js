import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType, realizeParametersForChannelWithoutType, toTsType, realizeParameterForChannelWithoutType, shouldPromisfyCallbacks} from '../../utils/index';
export function Publish(channelName, message, channelParameters) {
  return `

    var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
    var receivedMsg: Client.${getMessageType(message)} | undefined = undefined;
    ${
  Object.entries(channelParameters).map(([paramName, param]) => {
    return `var recieved${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`;
  }).join('')
}
    
    var publishMessage: TestClient.${getMessageType(message)} = ${generateExample(message.payload().json())};
    ${
  Object.entries(channelParameters).map(([paramName, param]) => {
    return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`;
  }).join('')
}
    const subscription = await testClient.subscribeTo${pascalCase(channelName)}((err, msg 
          ${
  Object.keys(channelParameters).length ?
    `
            ,${realizeParametersForChannelWithoutType(channelParameters)}
            ` : ''
}) => {
            receivedError = err;
            receivedMsg = msg;
            ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))} = ${paramName}`;
  }).join('')
}
        }
        ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `, ${pascalCase(paramName)}ToSend`;
  }).join('')
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
    await client.publishTo${pascalCase(channelName)}(publishMessage 
      ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `, ${pascalCase(paramName)}ToSend`;
  }).join('')
});
    await tryAndWaitForResponse;
    expect(receivedError).to.be.undefined;
    ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `expect(recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))}).to.be.equal(${pascalCase(paramName)}ToSend);`;
  }).join('')
}
    `;
}