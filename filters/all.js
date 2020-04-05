const URL = require('url');
const path = require('path');
const _ = require('lodash');

module.exports = ({ Nunjucks }) => {
	Nunjucks.addFilter('kebabCase', string => {
		return _.kebabCase(string);
	});

	Nunjucks.addFilter('camelCase', string => {
		return camelCase(string);
	});

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
	Nunjucks.addFilter(
		'isBinaryPayload',
		(messageContentType, defaultContentType) => {
			return containsPayload(messageContentType, defaultContentType, 'binary');
		}
	);
	Nunjucks.addFilter(
		'isStringPayload',
		(messageContentType, defaultContentType) => {
			return containsPayload(messageContentType, defaultContentType, 'string');
		}
	);
	Nunjucks.addFilter(
		'isJsonPayload',
		(messageContentType, defaultContentType) => {
			return containsPayload(messageContentType, defaultContentType, 'json');
		}
	);

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
	Nunjucks.addFilter('containsBinaryPayload', document => {
		return containsPayloadInDocument(document, 'binary');
	});
	Nunjucks.addFilter('containsStringPayload', document => {
		return containsPayloadInDocument(document, 'string');
	});
	Nunjucks.addFilter('containsJsonPayload', document => {
		return containsPayloadInDocument(document, 'json');
	});

	function camelCase(string) {
		return _.camelCase(string);
	}

	Nunjucks.addFilter('firstLowerCase', string => {
		return _.lowerFirst(string);
	});

	Nunjucks.addFilter('firstUpperCase', string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	});

	Nunjucks.addFilter('pascalCase', string => {
		return pascalCase(string);
	});
	function pascalCase(string) {
		string = _.camelCase(string);
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function toTsType(jsonSchemaType) {
		switch (jsonSchemaType.toLowerCase()) {
			case 'string':
				return 'string';
			case 'integer':
			case 'number':
				return 'Number';
			case 'boolean':
				return 'Boolean';
		}
	}
	Nunjucks.addFilter('toTsType', toTsType);

	Nunjucks.addFilter('realizeParametersForChannel', parameters => {
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
	});
	Nunjucks.addFilter('constructorParameters', schema => {
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
	});

	Nunjucks.addFilter('schemaConstructor', properties => {
		let returnString = '';
		for (const [key, value] of Object.entries(properties)) {
			returnString += `${key},`;
		}
		if (returnString.length > 1) {
			returnString = returnString.slice(0, -1);
		}
		return returnString;
	});

	Nunjucks.addFilter('print', string => {
		console.log(string);
	});
	Nunjucks.addFilter('oneLine', string => {
		if (!string) return string;
		return string.replace(/\n/g, ' ');
	});

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
	Nunjucks.addFilter('oneOfSchemaType', getTypeFromOneOf);

	Nunjucks.addFilter('fileName', string => {
		return _.camelCase(string);
	});

	Nunjucks.addFilter('tsPayload', server => {
		return 'STRING';
	});

	Nunjucks.addFilter('tsEncoding', server => {
		return 'STRING';
	});

	Nunjucks.addFilter('isPubsub', channel => {
		const tempChannel = channel._json;
		if (tempChannel.bindings && tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'pubsub') {
			return true;
		}
		return false;
	});

	Nunjucks.addFilter('hasNatsBindings', obj => {
		return obj.bindings && obj.bindings.nats;
	});

	Nunjucks.addFilter('isRequestReply', channel => {
		let tempChannel = channel._json;
		if (
			tempChannel.bindings &&
			tempChannel.bindings.nats &&
			tempChannel.bindings.nats.is == 'requestReply'
		) {
			return true;
		}
		return false;
	});

	Nunjucks.addFilter('isRequester', channel => {
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
	});

	Nunjucks.addFilter('isReplier', channel => {
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
	});
};
