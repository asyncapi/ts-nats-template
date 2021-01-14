import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';

/**
 * Request and reply test code
 * 
 * @param {*} channelName 
 * @param {*} replyMessage 
 * @param {*} receiveMessage 
 * @param {*} channelParameters 
 */ 
export function requestReply(channelName, replyMessage, receiveMessage, channelParameters) {
  const replyMessageExample = generateExample(replyMessage.payload().json());
  const receiveMessageExample = generateExample(receiveMessage.payload().json());
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const exampleParameters = getExampleParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);
  const replyCallbackParameters = getCallbackParameters(channelParameters);
  
  return `
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: TestClient.${getMessageType(receiveMessage)} | undefined = undefined;

${receivedVariableDeclaration}

var replyMessage: Client.${getMessageType(replyMessage)} = ${replyMessageExample};
var receiveMessage: TestClient.${getMessageType(receiveMessage)} = ${receiveMessageExample};
${exampleParameters}
const replySubscription = await client.replyTo${pascalCase(channelName)}((err, msg 
      ${replyCallbackParameters}) => {
    return new Promise((resolve, reject) => {
        receivedError = err;
        receivedMsg = msg;
        ${setReceivedVariable}
        resolve(replyMessage);
    })},
    (err) => {console.log(err)}
    ${functionParameters},
    true
);
var reply = await testClient.request${pascalCase(channelName)}(receiveMessage ${functionParameters});
expect(reply).to.be.deep.equal(replyMessage)
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(receiveMessage);
${verifyExpectedParameters}
    `;
}