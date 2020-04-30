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

filter.kebabCase = string => {
	return _.kebabCase(string);
}
filter.camelCase = string => {
	return camelCase(string);
}



/**
 * Figure out if a payload is located in the document.
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











filter.firstLowerCase = string => {
	return _.lowerFirst(string);
}
filter.firstUpperCase = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
filter.pascalCase = string => {
	return pascalCase(string);
}









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
				return property.uid();
			}else{
				return 'UndefinedObject';
			}
		default: return 'Undefined';
	}
}
filter.toTsType = toTsType
filter.realizeParametersForChannel = parameters => {
	let returnString = '';

	for (paramName in parameters) {
		returnString += `${paramName}:${toTsType(
			parameters[paramName].schema().type()
		)},`;
	}
	if (returnString.length >= 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}
filter.messageConstructorParameters = schema => {
	let returnString = '';
	if (schema.allOf()) {
		schema.allOf().forEach(element => {
			returnString += `${camelCase(element.uid())}: ${pascalCase(
				element.uid()
			)}Schema,`;
		});
	} else if (schema.oneOf()) {
		returnString += `oneOf: ${getTypeFromOneOf(schema.oneOf())},`;
	} else if (schema.anyOf()) {
		schema.anyOf().forEach(element => {
			returnString += `${camelCase(element.uid())}: ${pascalCase(
				element.uid()
			)}Schema,`;
		});
	} else if (schema.uid()) {
		returnString += `${camelCase(schema.uid())}: ${pascalCase(
			schema.uid()
		)}Schema,`;
	}
	if (returnString.length > 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}
filter.schemaConstructorParameters = schema => {
	let returnString = '';
	if (schema.allOf()) {
		schema.allOf().forEach(element => {
			returnString += `${camelCase(element.uid())}: ${pascalCase(
				element.uid()
			)},`;
		});
	}
	if (schema.oneOf()) {
		returnString += `oneOf: ${getTypeFromOneOf(schema.oneOf())},`;
	}
	if (schema.anyOf()) {
		schema.anyOf().forEach(element => {
			returnString += `${camelCase(element.uid())}: ${pascalCase(
				element.uid()
			)},`;
		});
	}
	if (schema.properties() && schema.required()) {
		schema.required().forEach(requiredPropertyName => {
			const property = schema.properties()[requiredPropertyName]
			if(property && property.required()){
				returnString += `${camelCase(requiredPropertyName)}: ${toTsType(property.type(), property)},`;
			}
		});
	}
	if (returnString.length > 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}
filter.schemaConstructor = properties => {
	let returnString = '';
	for (const [key, value] of Object.entries(properties)) {
		returnString += `${key},`;
	}
	if (returnString.length > 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}


function getTypeFromOneOf(oneFromSchema) {
	let type = '';

	if (oneFromSchema.oneOf().length > 0) {
		type += `${getTypeFromOneOf(oneFromSchema.oneOf())}Schema`;
	}

	for (var i = 0; i < oneOfSchema.length; i++) {
		let schema = oneOfSchema[i];
		if (type !== '') {
			type += '|';
		}
		if (oneOfSchema.length == i + 1) {
			type += schema.uid();
		} else {
			type += schema.uid() + '|';
		}
	}
	return type;
}
filter.oneOfSchemaType = getTypeFromOneOf
filter.fileName = string => {
	return _.camelCase(string);
}
filter.tsPayload = server => {
	return 'STRING';
}
filter.print = obj => {
	console.log(JSON.stringify(obj, null, 4))
}
filter.tsEncoding = server => {
	return 'STRING';
}
filter.isPubsub = channel => {
	const tempChannel = channel._json;
	if (tempChannel.bindings && tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'pubsub') {
		return true;
	}
	return false;
}
filter.hasNatsBindings = obj => {
	return obj.bindings && obj.bindings.nats;
}
filter.isRequestReply = channel => {
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
filter.isRequester = channel => {
	let tempChannel = channel._json;
	if (
		tempChannel.bindings &&
		tempChannel.bindings.nats &&
		tempChannel.bindings.nats.is == 'requestReply' &&
		tempChannel.bindings.nats.requestReply &&
		tempChannel.bindings.nats.requestReply.is == 'requester'
	) {
		return true;
	}
	return false;
}
filter.isReplier = channel => {
	let tempChannel = channel._json;
	if (
		tempChannel.bindings &&
		tempChannel.bindings.nats &&
		tempChannel.bindings.nats.is == 'requestReply' &&
		tempChannel.bindings.nats.requestReply &&
		tempChannel.bindings.nats.requestReply.is == 'replier'
	) {
		return true;
	}
	return false;
}
