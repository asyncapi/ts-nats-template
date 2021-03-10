import { pascalCase, realizeParametersForChannelWithoutType, toTsType} from '../../utils/index';
import {generateExample} from '@asyncapi/generator-filters';
// eslint-disable-next-line no-unused-vars
import { ChannelParameter } from '@asyncapi/parser';

/**
 * Get the code for received variable declaration
 * 
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getReceivedVariableDeclaration(channelParameters) {
  return Object.entries(channelParameters).map(([paramName, param]) => {
    return `var received${pascalCase(paramName)} : ${toTsType(param.schema().type())} | undefined = undefined`;
  }).join('');
}

/**
 * Get the code for example parameters
 * 
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getExampleParameters(channelParameters) {
  return Object.entries(channelParameters).map(([paramName, param]) => {
    return `var ${pascalCase(paramName)}ToSend: ${toTsType(param.schema().type())} = ${generateExample(param.schema().json())}`;
  }).join('');
}

/**
 * Get the code for function parameters
 * 
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getFunctionParameters(channelParameters) {
  return Object.entries(channelParameters).map(([paramName, _]) => {
    return `, ${pascalCase(paramName)}ToSend`;
  }).join('');
}

/**
 * Get the code for setting the received parameter variables
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getSetReceivedParameters(channelParameters) {
  return Object.entries(channelParameters).map(([paramName, _]) => {
    return `received${pascalCase(paramName)} = ${paramName}`;
  }).join('');
}

/**
 * Get the code for the expected received parameters
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getVerifyExpectedParameters(channelParameters) {
  return Object.entries(channelParameters).map(([paramName, _]) => {
    return `expect(received${pascalCase(paramName)}).to.be.equal(${pascalCase(paramName)}ToSend);`;
  }).join('');
}

/**
 * Get the code for the callback parameters
 * @param {{[key: string]: ChannelParameter}} channelParameters 
 */
export function getCallbackParameters(channelParameters) {
  return Object.keys(channelParameters).length ? `,${realizeParametersForChannelWithoutType(channelParameters)}` : '';
}
