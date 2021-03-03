import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';

export function request(channelName, replyMessage, receiveMessage, channelParameters) {
  return requestReply(channelName, replyMessage, receiveMessage, channelParameters, true); 
}
export function reply(channelName, replyMessage, receiveMessage, channelParameters) {
  return requestReply(channelName, replyMessage, receiveMessage, channelParameters, false); 
}

/**
 * Request and reply test code
 * 
 * @param {*} channelName 
 * @param {*} replyMessage 
 * @param {*} receiveMessage 
 * @param {*} channelParameters 
 * @param {boolean} requester is it the real client which does the request
 */ 
function requestReply(channelName, replyMessage, receiveMessage, channelParameters, requester) {
  const replyMessageExample = generateExample(replyMessage.payload().json());
  const receiveMessageExample = generateExample(receiveMessage.payload().json());
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const exampleParameters = getExampleParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);
  const replyCallbackParameters = getCallbackParameters(channelParameters);
  const requesterClientClass = requester ? 'Client' : 'TestClient';
  const requesterClient = requester ? 'client' : 'testClient';
  const replierClientClass = requester ? 'TestClient' : 'Client';
  const replierClient = requester ? 'testClient' : 'client';
  return `
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: ${requesterClientClass}.${getMessageType(receiveMessage)} | undefined = undefined;

${receivedVariableDeclaration}

var replyMessage: ${replierClientClass}.${getMessageType(replyMessage)} = ${replyMessageExample};
var receiveMessage: ${requesterClientClass}.${getMessageType(receiveMessage)} = ${receiveMessageExample};
${exampleParameters}
const replySubscription = await ${replierClient}.replyTo${pascalCase(channelName)}((err, msg 
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
var reply = await ${requesterClient}.request${pascalCase(channelName)}(receiveMessage ${functionParameters});
expect(reply).to.be.deep.equal(replyMessage)
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(receiveMessage);
${verifyExpectedParameters}
    `;
}