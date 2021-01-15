import { toTsType } from './general';

/**
 * Realize parameters without using types and without trailing comma
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
 * @param {*} channelParameters parameters to realize
 * @param {*} required optional or required
 */
export function realizeParametersForChannelWrapper(channelParameters, required = true) {
  return Object.keys(channelParameters).length ? `,${realizeParametersForChannel(channelParameters, required)}` : '';
}

/**
  * Realize parameters using types without trailing comma
  * @param {*} channelParameters parameters to realize
  * @param {*} required optional or required
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
 * @param {*} parameterName parameter name to use as
 * @param {*} parameter which contains the schema 
 * @param {*} required should it be optional or required
 */
function realizeParameterForChannelWithType(parameterName, parameter, required = true) {
  const requiredType = !required ? '?' : '';
  return `${parameterName}${requiredType}: ${toTsType(
    parameter.schema().type()
  )}`;
}