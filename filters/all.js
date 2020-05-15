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
				return property.uid() + 'Schema';
			}else{
				return 'UndefinedObject';
			}
		default: return 'Undefined';
	}
}
filter.toTsType = toTsType

filter.realizeChannelName = (parameters, channelName) => {
	let returnString = '\`' + channelName + '\`';
	returnString = returnString.replace(/\//g, `.`);
	for (paramName in parameters) {
		returnString = returnString.replace(`{${paramName}}`, `\${${paramName}}`);
	}
	return returnString;
}
filter.realizeChannelNameWithoutParameters = (channelName) => {
	return toNatsChannel(channelName, null)
}
function toNatsChannel(channelName, parameters){
	let returnString = '\`' + channelName + '\`';
	returnString = returnString.replace(/\//g, `.`);
	if(parameters){
		for (paramName in parameters) {
			returnString = returnString.replace(`{${paramName}}`, `\${${paramName}}`);
		}
	}
	return returnString;
}
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
filter.messageConstructorParameters = schema => {
	let returnString = '';
	if (schema.allOf()) {
		schema.allOf().forEach(element => {
			returnString += `${camelCase(element.uid())}: ${pascalCase(
				element.uid()
			)}Schema,`;
		});
	} 
	if (schema.uid() && schema.type() === "object") {
		returnString += `${camelCase(schema.uid())}: ${pascalCase(
			schema.uid()
		)}Schema,`;
	}
	if (returnString.length > 1) {
		returnString = returnString.slice(0, -1);
	}
	return returnString;
}
function genericImports(schema, imports) {
	if(!imports){
		imports = {}
	}
	if (schema.allOf()) {
		for(var allOf of schema.allOf()){
			imports = genericImports(allOf, imports);
		}
	}
	if (schema.oneOf()) {
		for(var oneOf of schema.oneOf()){
			imports = genericImports(oneOf, imports);
		}
	}
	if (schema.anyOf()) {
		for(var anyOf of schema.anyOf()){
			imports = genericImports(anyOf, imports);
		}
	}
	if (schema.type() && schema.type() === "object"){
		imports[schema.uid()] = `import { default as ${pascalCase(schema.uid())}Schema } from '#schemas/${pascalCase(schema.uid())}';`
	}
	return imports;
}
function schemaImports(schema, imports) {
	if(!imports){
		imports = {}
	}
	if (schema.allOf()) {
		for(var allOf of schema.allOf()){
			imports = schemaImports(allOf, imports)
		}
	}
	if (schema.oneOf()) {
		for(var oneOf of schema.oneOf()){
			imports = schemaImports(oneOf, imports)
		}
	}
	if (schema.anyOf()) {
		for(var anyOf of schema.anyOf()){
			imports = schemaImports(anyOf, imports)
		}
	}
	if (schema.properties()){
		for(const [_, property] of Object.entries(schema.properties())){
			imports = genericImports(property, imports)
		}
	}
	return imports;
}
filter.genericImports = genericImports;
filter.schemaImports = schemaImports;

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
	if (schema.type() && schema.type() === "object"){
		if (schema.properties() && schema.required()) {
			for(const [propertyName, property] of Object.entries(schema.properties())){
				if(property.required()){
					returnString += `${camelCase(propertyName)}: ${toTsType(property.type(), property)},`;
				}
			}
		}
	}else if(schema.type()){
		returnString += `type: ${toTsType(schema.type())},`;
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
