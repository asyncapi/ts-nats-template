import { toTsType } from './general';
// eslint-disable-next-line no-unused-vars
import {ChannelParameter} from '@asyncapi/parser';

/**
 * Realize parameters without using types and without trailing comma
 * 
 * @param {Object.<string, ChannelParameter>} parameters 
 * @returns 
 */
export function realizeParametersForChannelWithoutType(parameters) {
  let returnString = '';
  for (const paramName in parameters) {
    returnString += `${paramName},`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}
  
/**
 * Realize parameters for channels for function definitions in typescript
 * 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to realize
 * @param {boolean} required optional or required
 */
export function realizeParametersForChannelWrapper(channelParameters, required = true) {
  return Object.keys(channelParameters).length ? `,${realizeParametersForChannel(channelParameters, required)}` : '';
}

/**
  * Realize parameters using types without trailing comma
  * @param {Object.<string, ChannelParameter>} channelParameters parameters to realize
  * @param {boolean} required optional or required
  */
export function realizeParametersForChannel(channelParameters, required = true) {
  let returnString = '';
  for (const paramName in channelParameters) {
    returnString += `${realizeParameterForChannelWithType(paramName, channelParameters[`${paramName}`], required)  },`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}

/**
 * Realize a single parameter with its type 
 * 
 * @param {string} parameterName parameter name to use as
 * @param {ChannelParameter} parameter which contains the schema 
 * @param {boolean} required should it be optional or required
 */
function realizeParameterForChannelWithType(parameterName, parameter, required = true) {
  const requiredType = !required ? '?' : '';
  return `${parameterName}${requiredType}: ${toTsType(
    parameter.schema().type()
  )}`;
}

/**
 * Render channel parameters for JSDoc
 * 
 * @param {Object.<string, ChannelParameter>} channelParameters to render
 */
export function renderJSDocParameters(channelParameters) {
  return Object.keys(channelParameters).map((paramName) => {
    return `* @param ${paramName} parameter to use in topic`;
  }).join('\n');
}
