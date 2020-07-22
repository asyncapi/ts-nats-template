const fs = require('fs');
const Path = require('path');
const filters = require("../filters/all")
const { quicktype, InputData, JSONSchemaInput, JSONSchemaStore } = require("quicktype-core");

/**
 * Generate a typescript structure from a schema. 
 * 
 * @param {String} schemaPath Path to the folder to store the generated files
 * @param {*} schemaName The name of the schema to generate
 * @param {*} jsonSchema The schema to generate
 */
async function genSchema(schemaPath, schemaName, jsonSchema){
	const schemaString = JSON.stringify(jsonSchema.json());
	const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
	await schemaInput.addSource({ name: schemaName, schema: schemaString });
	const inputData = new InputData();
	inputData.addInput(schemaInput)
	const { lines } = await quicktype({ lang: "typescript", inputData });
	await fs.promises.mkdir(schemaPath, { recursive: true }).catch(console.error);
	fs.mkdirSync(schemaPath, { recursive: true });
	fs.writeFileSync(Path.join(schemaPath, filters.pascalCase(schemaName)+".ts"), lines.join("\n"));
}

/**
 * Use quicktype to generate messages with their payload.
 */
module.exports = {
	'generate:after': async (generator) => {
		const allMessages = generator.asyncapi.allMessages();
		for (let [messageId, message] of allMessages) {
			const payloadSchema = message.payload();
			//Null payload is not supported by quicktype, and cannot be generated.
			if(payloadSchema.type()+"" != "null"){
				const filepath = Path.join(generator.targetDir, "src/messages/");
				await genSchema(filepath, messageId, message.payload());
			}
		}
	}
};
