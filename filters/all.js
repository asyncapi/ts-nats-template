const filter = module.exports;
const _ = require('lodash');


/**
 * Figure out if our message content type or default content type matches a given payload.
 * @param {*} messageContentType to check
 * @param {*} defaultContentType to check
 * @param {*} payload to find
 */
function containsPayload(messageContentType, defaultContentType, payload) {
	if (
		(messageContentType != null &&
			messageContentType.toLowerCase() == payload) ||
		(defaultContentType != null && defaultContentType == payload)
	) {
		return true;
	}
	return false;
}
filter.isBinaryPayload = (messageContentType, defaultContentType) => {
	return containsPayload(messageContentType, defaultContentType, 'binary');
}
filter.isStringPayload = (messageContentType, defaultContentType) => {
	return containsPayload(messageContentType, defaultContentType, 'string');
}
filter.isJsonPayload = (messageContentType, defaultContentType) => {
	return containsPayload(messageContentType, defaultContentType, 'json');
}

filter.messageHasNotNullPayload = (messagePayload) => {
	return messagePayload.type()+"" != "null";
}

/**
 * Because quicktype cant handle null types we have to ensure if it is null thats 
 */
filter.getMessageType = (message) => {
	if(message.payload().type()+"" == "null"){
		return "null";
	}else{
		return `${this.pascalCase(message.uid())}Message.${this.pascalCase(message.uid())}`;
	}
}

/**
 * Figure out if a content type is located in the document.
 * @param {*} document to look through
 * @param {*} payload to find
 */
function containsPayloadInDocument(document, payload) {
	if (
		document.defaultContentType() != null &&
		document.defaultContentType().toLowerCase() == payload
	) {
		return true;
	}
	if (document.channels() != null) {
		for (let channelName in document.channels()) {
			let channel = document.channels()[channelName];
			if (
				(channel.hasPublish() &&
					channel
						.publish()
						.message()
						.contentType() != null &&
					channel
						.publish()
						.message()
						.contentType()
						.toLowerCase() == payload) ||
				(channel.hasSubscribe() &&
					channel
						.subscribe()
						.message()
						.contentType() != null &&
					channel
						.subscribe()
						.message()
						.contentType()
						.toLowerCase() == payload)
			) {
				return true;
			}
		}
	}
	return false;
}
filter.containsBinaryPayload = document => {
	return containsPayloadInDocument(document, 'binary');
}
filter.containsStringPayload = document => {
	return containsPayloadInDocument(document, 'string');
}
filter.containsJsonPayload = document => {
	return containsPayloadInDocument(document, 'json');
}

function camelCase(string) {
	return _.camelCase(string);
}
function pascalCase(string) {
	string = _.camelCase(string);
	return string.charAt(0).toUpperCase() + string.slice(1);
}

filter.firstUpperCase = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
filter.pascalCase = string => {
	return pascalCase(string);
}
filter.kebabCase = string => {
	return _.kebabCase(string);
}

filter.camelCase = string => {
	return camelCase(string);
}

/**
 * Convert JSON schema draft 7 types to typescript types 
 * @param {*} jsonSchemaType 
 * @param {*} property 
 */
function toTsType(jsonSchemaType, property) {
	switch (jsonSchemaType.toLowerCase()) {
		case 'string':
			return 'string';
		case 'integer':
		case 'number':
			return 'Number';
		case 'boolean':
			return 'Boolean';
		case 'object':
			if(property){
				return property.uid() + 'Schema';
			}else{
				return 'any';
			}
		default: return 'any';
	}
}


/**
 * Cast JSON schema variable to typescript type
 * 
 * @param {*} jsonSchemaType 
 * @param {*} variableToCast 
 */
function castToTsType(jsonSchemaType, variableToCast) {
	switch (jsonSchemaType.toLowerCase()) {
		case 'string':
			return `"" + ${variableToCast}`;
		case 'integer':
		case 'number':
			return `Number(${variableToCast})`;
		case 'boolean':
			return `Boolean(${variableToCast})`;
		default: throw new Error("Parameter type not supported - " + jsonSchemaType);
	}
}
filter.castToTsType = castToTsType;

/**
 * Convert RFC 6570 URI with parameters to NATS topic. 
 */
function realizeChannelName(parameters, channelName){
	let returnString = '\`' + channelName + '\`';
	returnString = returnString.replace(/\//g, `.`);
	for (paramName in parameters) {
		returnString = returnString.replace(`{${paramName}}`, `\${${paramName}}`);
	}
	return returnString;
}

filter.realizeChannelName = realizeChannelName;

filter.realizeChannelNameWithoutParameters = (channelName) => {
	return realizeChannelName(null, channelName);
}

/**
 * Realize parameters without using types without trailing comma
 */
filter.realizeParametersForChannelWithoutType = (parameters) => {
	let returnString = '';
	for (paramName in parameters) {
		returnString += `${paramName},`;
	}
	if (returnString.length >= 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}

/**
 * Realize parameters using types without trailing comma
 */
filter.realizeParametersForChannel = (parameters, required = true) => {
	let returnString = '';
	const requiredType = !required ? '?' : ''
	for (paramName in parameters) {
		returnString += `${paramName}${requiredType}: ${toTsType(
			parameters[paramName].schema().type()
		)},`;
	}
	if (returnString.length >= 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}

/**
 * Does an object have bindings
 */
filter.hasNatsBindings = obj => {
	return obj.bindings && obj.bindings.nats;
}

/**
 * is the channel a publish and subscribe type if nothing is specified default to being pubsub type 
 */
filter.isPubsub = channel => {
	const tempChannel = channel._json;
	if (
		!tempChannel.bindings || 
		!tempChannel.bindings.nats ||
		!tempChannel.bindings.nats.is || 
		tempChannel.bindings.nats.is == 'pubsub') {
		return true;
	}
	return false;
}

/**
 * is the channel a request and reply
 */
function isRequestReply(channel){
	let tempChannel = channel._json;
	if (
		tempChannel.bindings &&
		tempChannel.bindings.nats &&
		tempChannel.bindings.nats.is == 'requestReply'
	) {
		return true;
	}
	return false;
}
filter.isRequestReply = isRequestReply;

/**
 * Is the request reply a requester
 */
filter.isRequester = channel => {
	let tempChannel = channel._json;
	if (
		isRequestReply(channel) &&
		tempChannel.bindings.nats.requestReply &&
		tempChannel.bindings.nats.requestReply.is == 'requester'
	) {
		return true;
	}
	return false;
}

/**
 * Is the request reply a replier
 */
filter.isReplier = channel => {
	let tempChannel = channel._json;
	if (
		isRequestReply(channel) &&
		tempChannel.bindings.nats.requestReply &&
		tempChannel.bindings.nats.requestReply.is == 'replier'
	) {
		return true;
	}
	return false;
}
