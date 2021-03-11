import {generateExample} from '@asyncapi/generator-filters';
import { pascalCase, getMessageType} from '../../utils/index';
import {getReceivedVariableDeclaration, getExampleParameters, getFunctionParameters, getSetReceivedParameters, getVerifyExpectedParameters, getCallbackParameters} from './general';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter,  } from '@asyncapi/parser';

/**
 * Generate test code where the client requests and test client replies
 * 
 * @param {string} channelName 
 * @param {Message} replyMessage 
 * @param {Message} receiveMessage 
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @returns 
 */
export function request(channelName, replyMessage, receiveMessage, channelParameters) {
  return requestReply(channelName, replyMessage, receiveMessage, channelParameters, true); 
}

/**
 * Generate test code where the client replies and test client requests
 * 
 * @param {string} channelName 
 * @param {Message} replyMessage 
 * @param {Message} receiveMessage
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @returns 
 */
export function reply(channelName, replyMessage, receiveMessage, channelParameters) {
  return requestReply(channelName, replyMessage, receiveMessage, channelParameters, false); 
}

/**
 * Request and reply test code
 * 
 * @param {string} channelName 
 * @param {Message} replyMessage 
 * @param {Message} receiveMessage 
 * @param {Object.<string, ChannelParameter>} channelParameters 
 * @param {boolean} realClientRequests is it the real client which does the request
 */ 
function requestReply(channelName, replyMessage, receiveMessage, channelParameters, realClientRequests) {
  const replyMessageExample = generateExample(replyMessage.payload().json());
  const receiveMessageExample = generateExample(receiveMessage.payload().json());
  const receivedVariableDeclaration = getReceivedVariableDeclaration(channelParameters);
  const exampleParameters = getExampleParameters(channelParameters);
  const functionParameters = getFunctionParameters(channelParameters);
  const setReceivedVariable = getSetReceivedParameters(channelParameters);
  const verifyExpectedParameters = getVerifyExpectedParameters(channelParameters);
  const replyCallbackParameters = getCallbackParameters(channelParameters);
  const requesterClientClass = realClientRequests ? 'Client' : 'TestClient';
  const requesterClient = realClientRequests ? 'client' : 'testClient';
  const replierClientClass = realClientRequests ? 'TestClient' : 'Client';
  const replierClient = realClientRequests ? 'testClient' : 'client';
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
