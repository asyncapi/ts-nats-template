import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';

export function publish(channelName, message, channelParameters) {
  return publishSubscribe(channelName, message, channelParameters, true)
}
export function subscribe(channelName, message, channelParameters) {
  return publishSubscribe(channelName, message, channelParameters, false)
}

/**
 * Publish and subscribe test code
 * 
 * @param {*} channelName 
 * @param {*} message 
 * @param {*} channelParameters 
 * @param {Boolean} publish is the real client the one to publish 
 * 
 */
function publishSubscribe(channelName, message, channelParameters, publish) {
  const exampleParameters = getExampleParameters(channelParameters);
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const subscribeToCallbackParameters = getCallbackParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);
  const subscribeClientClass = publish ? 'TestClient' : 'Client';
  const subscribeClient = publish ? 'testClient' : 'client';
  const publishClientClass = publish ? 'Client' : 'TestClient';
  const publishClient = publish ? 'client' : 'testClient';

  return `
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: ${subscribeClientClass}.${getMessageType(message)} | undefined = undefined;
${receivedVariableDeclaration}

var publishMessage: ${publishClientClass}.${getMessageType(message)} = ${publishClientClass}.example${getMessageType(message)};
${exampleParameters}
const subscription = await ${subscribeClient}.subscribeTo${pascalCase(channelName)}((err, msg 
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
await ${publishClient}.publishTo${pascalCase(channelName)}(publishMessage ${functionParameters});
await tryAndWaitForResponse;
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(publishMessage);
${verifyExpectedParameters}
    `;
}