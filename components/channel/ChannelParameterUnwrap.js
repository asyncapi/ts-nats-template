
import { camelCase, castToTsType, realizeChannelNameWithoutParameters } from '../../utils/general';
export function unwrap(channelName, channelParameters) {
  let parameterSplit = '';
  let prevParameterName = null;
  parameterSplit = channelParameters.map(([parameterName, _]) => {
    let toReturn;
    const parameterCamelCase = camelCase(parameterName);
    if (prevParameterName) {
      toReturn = `var ${parameterCamelCase}Split = ${prevParameterName}Split[1].split("${`{${parameterName}}`}");`;
    } else {
      toReturn = `var ${parameterCamelCase}Split = unmodifiedChannel.split("${`{${parameterName}}`}");`;
    }
    prevParameterName = parameterCamelCase;
    return toReturn;
  });

  let splits = '';
  splits = channelParameters.map(([parameterName, _], index) => {
    if (index+1 === Object.keys(channelParameters).length) {
      return `
			${camelCase(parameterName)}Split[0],
			${camelCase(parameterName)}Split[1]
			`;
    }
    return `
			${camelCase(parameterName)}Split[0],
			`;
  });

  prevParameterName = null;
  let parameterReplacement = '';
  parameterReplacement = channelParameters.map(([parameterName, parameter], index) => {
    let channelSplit = `channel = channel.substring(${prevParameterName}}End+splits[${index}].length);`;
    if (index === 0) {
      channelSplit = `channel = channel.substring(splits[${index}].length);`;
    }

    const paramVarToCast = `channel.substring(0, ${camelCase(parameterName)}End)`;
    prevParameterName = camelCase(parameterName);
    return `
			${channelSplit}
			${paramVarToCast}
			var ${camelCase(parameterName)}End = channel.indexOf(splits[${index+1}}]);
			var ${camelCase(parameterName)}Param = ${castToTsType(parameter.schema().type(), paramVarToCast)};
		`;
  });

  if (Object.keys(channelParameters).length) {
    return `
		var unmodifiedChannel = ${realizeChannelNameWithoutParameters(channelName)};
		var channel = msg.subject;
		${parameterSplit.join('')}
		const splits = [
			${splits.join('')}
		];
		${parameterReplacement.join('')}
		`;
  } 
  return '';
}
