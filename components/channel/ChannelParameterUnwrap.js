
import { camelCase, castToTsType, realizeChannelNameWithoutParameters } from '../../utils/index';

/**
 * Component which contains the parameter unwrapping functionality.
 * 
 * 
 * Example
  const unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
  const channel = msg.subject;
  const streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");
  const splits = [
    streetlightIdSplit[0],
    streetlightIdSplit[1]
  ];
  channel = channel.substring(splits[0].length);
  const streetlightIdEnd = channel.indexOf(splits[1]);
  const streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);
 * 
 * 
 * @param {*} channelName to be unwrapped
 * @param {*} channelParameters the parameters which are to be unwrapped from the NATS topic.
 */
export function unwrap(channelName, channelParameters) {
  //Nothing to unwrap if no parameters are used
  if (Object.keys(channelParameters).length === 0) {
    return '';
  }

  let parameterSplit = '';
  let prevParameterName = null;

  //Create the parameter split operation which unwraps it one by one.
  parameterSplit = Object.entries(channelParameters).map(([parameterName, _]) => {
    let toReturn;
    const parameterCamelCase = camelCase(parameterName);
    if (prevParameterName) {
      toReturn = `const ${parameterCamelCase}Split = ${prevParameterName}Split[1].split("${`{${parameterName}}`}");`;
    } else {
      toReturn = `const ${parameterCamelCase}Split = unmodifiedChannel.split("${`{${parameterName}}`}");`;
    }
    prevParameterName = parameterCamelCase;
    return toReturn;
  });

  //Create the split array which contains the string between each parameter
  let splits = '';
  splits = Object.entries(channelParameters).map(([parameterName, _], index) => {
    const parameterCamelCase = camelCase(parameterName);
    // Check if we reached the end of the parameter list
    if (index+1 === Object.keys(channelParameters).length) {
      return `
      ${parameterCamelCase}Split[0],
      ${parameterCamelCase}Split[1]
      `;
    }
    return `${parameterCamelCase}Split[0],`;
  });

  //Retreive the actual parameters from the received NATS topic using the split array
  prevParameterName = null;
  let parameterReplacement = '';
  parameterReplacement = Object.entries(channelParameters).map(([parameterName, parameter], index) => {
    let channelSplit = `channel = channel.substring(${prevParameterName}End+splits[${index}].length);`;
    // Overwrite the split if it is the first parameter
    if (index === 0) {
      channelSplit = `channel = channel.substring(splits[${index}].length);`;
    }
    prevParameterName = camelCase(parameterName);
    const paramconstToCast = `channel.substring(0, ${prevParameterName}End)`;
    return `
      ${channelSplit}
      const ${prevParameterName}End = channel.indexOf(splits[${index+1}]);
      const ${prevParameterName}Param = ${castToTsType(parameter.schema().type(), paramconstToCast)};
    `;
  });


  return `
  const unmodifiedChannel = ${realizeChannelNameWithoutParameters(channelName)};
  let channel = msg.subject;
  ${parameterSplit.join('')}
  const splits = [
    ${splits.join('')}
  ];
  ${parameterReplacement.join('')}
  `;
}
