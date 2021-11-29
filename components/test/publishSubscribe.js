import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter,  } from '@asyncapi/parser';

/**
 * Generate test code where the client publishes and test client subscribes
 * 
 * @param {string} channelName 
 * @param {Message} message 
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @returns 
 */
export function publish(channelName, message, channelParameters) {
  return publishSubscribe(channelName, message, channelParameters, true);
}

/**
 * Generate test code where the client subscribes and test client publishes
 * 
 * @param {string} channelName 
 * @param {Message} message 
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @returns 
 */
export function subscribe(channelName, message, channelParameters) {
  return publishSubscribe(channelName, message, channelParameters, false);
}

/**
 * Publish and subscribe test code
 * 
 * @param {string} channelName 
 * @param {Message} message 
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @param {Boolean} realClientPublish is it the real client the one to publish 
 * 
 */
function publishSubscribe(channelName, message, channelParameters, realClientPublish) {
  const publishMessageExample = generateExample(message.payload().json());
  const exampleParameters = getExampleParameters(channelParameters);
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const subscribeToCallbackParameters = getCallbackParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);
  const subscribeClientClass = realClientPublish ? 'TestClient' : 'Client';
  const subscribeClient = realClientPublish ? 'testClient' : 'client';
  const publishClientClass = realClientPublish ? 'Client' : 'TestClient';
  const publishClient = realClientPublish ? 'client' : 'testClient';

  return `
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: ${subscribeClientClass}.${getMessageType(message)} | undefined = undefined;
${receivedVariableDeclaration}

var publishMessage: ${publishClientClass}.${getMessageType(message)} = ${publishClientClass}.${getMessageType(message)}.unmarshal(${publishMessageExample});
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
            resolve(undefined);
            isReturned = true
        }
    }, 100);
});
await ${publishClient}.publishTo${pascalCase(channelName)}(publishMessage ${functionParameters});
await tryAndWaitForResponse;
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.not.be.undefined;
expect(receivedMsg!.marshal()).to.equal(publishMessage.marshal());
${verifyExpectedParameters}
    `;
}
