import _ from 'lodash';
import {FormatHelpers} from '@asyncapi/modelina';
// eslint-disable-next-line no-unused-vars
import { Message, Schema, AsyncAPIDocument} from '@asyncapi/parser';
const contentTypeJSON = 'application/json';
const contentTypeString = 'text/plain';
const contentTypeBinary = 'application/octet-stream';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 */

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
 * Returns the schema file name
 * 
 * @param {string} schemaName 
 * @returns 
 */
export function getSchemaFileName(schemaName) {
  return FormatHelpers.toPascalCase(schemaName);
}

/**
 * Figure out if our message content type or default content type matches a given payload.
 * 
 * @param {string} messageContentType to check against payload
 * @param {string} defaultContentType to check against payload
 * @param {string} payload to check
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
  return containsPayload(messageContentType, defaultContentType, contentTypeBinary);
}
export function isStringPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, contentTypeString);
}
export function isJsonPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, contentTypeJSON);
}

/**
 * Based on the payload type of the message choose a client
 * 
 * @param {Message} message 
 * @param {string} defaultContentType 
 */
export function getClientToUse(message, defaultContentType) {
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    return 'const nc: Client = this.binaryClient!;';
  } else if (isStringPayload(message.contentType(), defaultContentType)) {
    return 'const nc: Client = this.stringClient!;';
  }
  //Default to JSON client
  return 'const nc: Client = this.jsonClient!;';
}

/**
 * Checks if the message payload is of type null
 * 
 * @param {Schema} messagePayload to check
 * @returns {boolean} does the payload contain null type 
 */
export function messageHasNotNullPayload(messagePayload) {
  return `${messagePayload.type()}` !== 'null';
}

/**
 * Get message type ensure that the correct message type is returned.
 * 
 * @param {Message} message to find the message type for
 */
export function getMessageType(message) {
  if (`${message.payload().type()}` === 'null') {
    return 'null';
  }
  return `${getSchemaFileName(message.payload().uid())}`;
}

/**
 * Figure out if a content type is located in the document.
 * 
 * @param {AsyncAPIDocument} document to look through
 * @param {string} payload to find
 */
function containsPayloadInDocument(document, payload) {
  if (
    document.hasDefaultContentType() &&
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
  return containsPayloadInDocument(document, contentTypeBinary);
}
export function containsStringPayload(document) {
  return containsPayloadInDocument(document, contentTypeString);
}
export function containsJsonPayload(document) {
  const containsJsonPayload = containsPayloadInDocument(document, contentTypeJSON);
  //Default to JSON type
  return containsJsonPayload || (!containsBinaryPayload(document) && !containsStringPayload(document));
}

/**
 * Convert JSON schema draft 7 types to typescript types 
 * 
 * @param {string} jsonSchemaType 
 * @param {string} property 
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
 * @param {string} jsonSchemaType 
 * @param {string} variableToCast 
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
  default: throw new Error(`Parameter type not supported - ${jsonSchemaType}`);
  }
}
