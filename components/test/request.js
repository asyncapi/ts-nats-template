import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType, realizeParametersForChannelWithoutType, toTsType, realizeParameterForChannelWithoutType} from '../../utils/general';
export function Request(channelName, requestMessage, replyMessage, channelParameters) {
  return `
    var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
    var receivedMsg: Client.{requestMessage | getMessageType} | undefined = undefined;
    ${
  Object.entries(channelParameters).map(([paramName, param]) => {
    return `var recieved${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`;
  }).join('')
}
    
    var replyMessage: TestClient.${getMessageType(replyMessage)} = ${generateExample(replyMessage.payload().json())};
    var requestMessage: Client.${getMessageType(requestMessage)}  = ${generateExample(requestMessage.payload().json())};
    ${
  Object.entries(channelParameters).map(([paramName, param]) => {
    return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`;
  }).join('')
}
    const replySubscription = await testClient.replyTo${pascalCase(channelName)}((err, msg 
        ${
  Object.keys(channelParameters).length ? 
    `
          ,${realizeParametersForChannelWithoutType(channelParameters)}
          ` : ''
}) => {
        return new Promise((resolve, reject) => {
            receivedError = err;
            receivedMsg = msg;
            ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))} = ${paramName}`;
  }).join('')
}
            resolve(replyMessage);
        })},
        (err) => {console.log(err)}
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
            if(replySubscription.getReceived() === 1){
                resolve();
                isReturned = true
            }
        }, 100);
    });
    var reply = await client.request${pascalCase(channelName)}(requestMessage 
      ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `, ${pascalCase(paramName)}ToSend`;
  }).join('')
});
    await tryAndWaitForResponse;
    expect(reply).to.be.deep.equal(replyMessage)
    expect(receivedError).to.be.undefined;
    expect(receivedMsg).to.be.deep.equal(requestMessage);
    ${
  Object.entries(channelParameters).map(([paramName, _]) => {
    return `expect(recieved${pascalCase(realizeParameterForChannelWithoutType(paramName))}).to.be.equal(${pascalCase(paramName)}ToSend);`;
  }).join('')
}
    `;
}