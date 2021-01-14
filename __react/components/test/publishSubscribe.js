import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';

/**
 * Publish and subscribe test code
 * 
 * @param {*} channelName 
 * @param {*} message 
 * @param {*} channelParameters 
 */
export function publishSubscribe(channelName, message, channelParameters) {
  const publishMessageExample = generateExample(message.payload().json());
  const exampleParameters = getExampleParameters(channelParameters);
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const subscribeToCallbackParameters = getCallbackParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);

  return `
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: Client.${getMessageType(message)} | undefined = undefined;
${receivedVariableDeclaration}

var publishMessage: TestClient.${getMessageType(message)} = ${publishMessageExample};
${exampleParameters}
const subscription = await testClient.subscribeTo${pascalCase(channelName)}((err, msg 
      ${subscribeToCallbackParameters}) => {
        receivedError = err;
        receivedMsg = msg;
        ${setReceivedVariable}
    }
    ${functionParameters},
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
await client.publishTo${pascalCase(channelName)}(publishMessage ${functionParameters});
await tryAndWaitForResponse;
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(publishMessage);
${verifyExpectedParameters}
    `;
}