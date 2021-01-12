import { toTsType } from './general';
/**
 * Realize parameters without using types and without trailing comma
 */
export function realizeParametersForChannelWithoutType(parameters) {
  let returnString = '';
  for (const paramName in parameters) {
    returnString += `${realizeParameterForChannelWithoutType(paramName)},`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}
  
export function realizeParametersForChannelWrapper(channelParameters, required = true) {
  return Object.keys(channelParameters).length ? `,${realizeParametersForChannel(channelParameters, required)}` : '';
}
  
/**
 * Realize parameters using types without trailing comma
 */
export function realizeParametersForChannel(parameters, required = true) {
  let returnString = '';
  for (const paramName in parameters) {
    returnString += `${realizeParameterForChannelWithType(paramName, parameters[`${paramName}`], required)  },`;
  }
  if (returnString.length >= 1) {
    returnString = returnString.slice(0, -1);
  }
  return returnString;
}

export function realizeParameterForChannelWithoutType(parameterName) {
  return `${parameterName}`;
}
function realizeParameterForChannelWithType(parameterName, parameter, required = true) {
  const requiredType = !required ? '?' : '';
  return `${parameterName}${requiredType}: ${toTsType(
    parameter.schema().type()
  )}`;
}