const _ = require('lodash');

export function camelCase(string) {
  return _.camelCase(string);
}
export function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function firstUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function kebabCase(string) {
  return _.kebabCase(string);
}

/**
 * Figure out if our message content type or default content type matches a given payload.
 * @param {*} messageContentType to check
 * @param {*} defaultContentType to check
 * @param {*} payload to find
 */
function containsPayload(messageContentType, defaultContentType, payload) {
  if (
    (messageContentType !== undefined &&
      messageContentType.toLowerCase() === payload) ||
    (defaultContentType !== undefined && defaultContentType === payload)
  ) {
    return true;
  }
  return false;
}
export function isBinaryPayload (messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, 'binary');
}
export function isStringPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, 'string');
}
export function isJsonPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, 'json');
}

export function messageHasNotNullPayload(messagePayload) {
  return `${messagePayload.type()}` !== 'null';
}

/**
 * Because quicktype cant handle null types we have to ensure if it is null thats 
 */
export function getMessageType(message) {
  if (`${message.payload().type()}` === 'null') {
    return 'null';
  }
  return `${pascalCase(message.uid())}Message.${pascalCase(message.uid())}`;
}

/**
 * Figure out if a content type is located in the document.
 * @param {*} document to look through
 * @param {*} payload to find
 */
function containsPayloadInDocument(document, payload) {
  if (
    document.defaultContentType() !== undefined &&
    document.defaultContentType().toLowerCase() === payload
  ) {
    return true;
  }
  const channels = document.channels();
  if (channels !== undefined) {
    for (const key in document.channels()) {
      if (Object.hasOwnProperty.call(document.channels(), key)) {
        const channel = document.channels()[`${key}`];
        if (
          (channel.hasPublish() &&
            channel
              .publish()
              .message()
              .contentType() !== undefined &&
            channel
              .publish()
              .message()
              .contentType()
              .toLowerCase() === payload) ||
          (channel.hasSubscribe() &&
            channel
              .subscribe()
              .message()
              .contentType() !== undefined &&
            channel
              .subscribe()
              .message()
              .contentType()
              .toLowerCase() === payload)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}
export function containsBinaryPayload(document) {
  return containsPayloadInDocument(document, 'binary');
}
export function containsStringPayload(document) {
  return containsPayloadInDocument(document, 'string');
}
export function containsJsonPayload(document) {
  return containsPayloadInDocument(document, 'json');
}

/**
 * Convert JSON schema draft 7 types to typescript types 
 * @param {*} jsonSchemaType 
 * @param {*} property 
 */
export function toTsType(jsonSchemaType, property) {
  switch (jsonSchemaType.toLowerCase()) {
  case 'string':
    return 'string';
  case 'integer':
  case 'number':
    return 'Number';
  case 'boolean':
    return 'Boolean';
  case 'object':
    if (property) {
      return `${property.uid()  }Schema`;
    }
    return 'any';
      
  default: return 'any';
  }
}

/**
 * Cast JSON schema variable to typescript type
 * 
 * @param {*} jsonSchemaType 
 * @param {*} variableToCast 
 */
export function castToTsType(jsonSchemaType, variableToCast) {
  switch (jsonSchemaType.toLowerCase()) {
  case 'string':
    return `"" + ${variableToCast}`;
  case 'integer':
  case 'number':
    return `Number(${variableToCast})`;
  case 'boolean':
    return `Boolean(${variableToCast})`;
  default: throw new Error(`Parameter type not supported - ${  jsonSchemaType}`);
  }
}

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

export function realizeChannelNameWithoutParameters(channelName) {
  return realizeChannelName(null, channelName);
}

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

export function realizeParameterForChannelWithoutType(parameterName) {
  return `${parameterName}`;
}
export function realizeParameterForChannelWithType(parameterName, parameter, required = true) {
  const requiredType = !required ? '?' : '';
  return `${parameterName}${requiredType}: ${toTsType(
    parameter.schema().type()
  )}`;
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

/**
 * Does an object have bindings
 */
export function hasNatsBindings(obj) {
  return obj.bindings && obj.bindings.nats;
}

/**
 * is the channel a publish and subscribe type if nothing is specified default to being pubsub type 
 */
export function isPubsub(channel) {
  const tempChannel = channel._json;
  if (
    !tempChannel.bindings || 
    !tempChannel.bindings.nats ||
    !tempChannel.bindings.nats.is || 
    tempChannel.bindings.nats.is === 'pubsub') {
    return true;
  }
  return false;
}

/**
 * is the channel a request and reply
 */
export function isRequestReply(channel) {
  const tempChannel = channel._json;
  if (
    tempChannel.bindings &&
    tempChannel.bindings.nats &&
    tempChannel.bindings.nats.is === 'requestReply'
  ) {
    return true;
  }
  return false;
}

/**
 * Is the request reply a requester
 */
export function isRequester(channel) {
  const tempChannel = channel._json;
  if (
    isRequestReply(channel) &&
    tempChannel.bindings.nats.requestReply &&
    tempChannel.bindings.nats.requestReply.is === 'requester'
  ) {
    return true;
  }
  return false;
}

/**
 * Is the request reply a replier
 */
export function isReplier(channel) {
  const tempChannel = channel._json;
  if (
    isRequestReply(channel) &&
    tempChannel.bindings.nats.requestReply &&
    tempChannel.bindings.nats.requestReply.is === 'replier'
  ) {
    return true;
  }
  return false;
}