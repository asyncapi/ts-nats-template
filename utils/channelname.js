
/**
 * Convert RFC 6570 URI with parameters to NATS topic. 
 */
export function realizeChannelName(parameters, channelName) {
  let returnString = `\`${  channelName  }\``;
  returnString = returnString.replace(/\//g, '.');
  for (const paramName in parameters) {
    returnString = returnString.replace(`{${paramName}}`, `\${${paramName}}`);
  }
  return returnString;
}
  
/**
 * Realize channel name to NATS topic without replacing parameters
 * @param {*} channelName 
 */
export function realizeChannelNameWithoutParameters(channelName) {
  return realizeChannelName(null, channelName);
}
  
