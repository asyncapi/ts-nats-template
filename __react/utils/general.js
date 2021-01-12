import _ from 'lodash';

/**
 * Should the callbacks be promisified.
 * 
 * @param {*} params passed to the template
 * @returns {boolean} should it promisify callbacks
 */
export function shouldPromisifyCallbacks(params) {
  return params.promisifyReplyCallback;
}


export function camelCase(string) {
  return _.camelCase(string);
}
export function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function kebabCase(string) {
  return _.kebabCase(string);
}

/**
 * Figure out if our message content type or default content type matches a given payload.
 * 
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

/**
 * Based on the payload type of the message choose a client
 * 
 * @param {*} message 
 * @param {*} defaultContentType 
 */
export function getClientToUse(message, defaultContentType) {
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    return 'const nc: Client = this.binaryClient!;';
  } else if (isStringPayload(message.contentType(), defaultContentType)) {
    return 'const nc: Client = this.stringClient!;';
  } else if (isJsonPayload(message.contentType(), defaultContentType)) {
    return 'const nc: Client = this.jsonClient!;';
  } 
  //Default to JSON client
  return 'const nc: Client = this.jsonClient!;';
}

/**
 * Checks if the message payload is of type null
 * 
 * @param {*} messagePayload to check
 * @returns {boolean} does the payload contain null type 
 */
export function messageHasNotNullPayload(messagePayload) {
  return `${messagePayload.type()}` !== 'null';
}

/**
 * Because quicktype cant handle null types we have to ensure that the correct message type is returned.
 * 
 * @param {*} message to find the message type for
 */
export function getMessageType(message) {
  if (`${message.payload().type()}` === 'null') {
    return 'null';
  }
  return `${pascalCase(message.uid())}Message.${pascalCase(message.uid())}`;
}

/**
 * Figure out if a content type is located in the document.
 * 
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
 * 
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
      return `${property.uid()}Schema`;
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
