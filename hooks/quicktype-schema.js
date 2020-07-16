const fs = require('fs');
const Path = require('path');
const filters = require("../filters/all")
const { quicktype, InputData, JSONSchemaInput, JSONSchemaStore } = require("quicktype-core");
async function genSchema(schemaPath, schemaName, jsonSchema){
	const schemaString = JSON.stringify(jsonSchema.json());
	const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
	await schemaInput.addSource({ name: schemaName, schema: schemaString });
	const inputData = new InputData();
	inputData.addInput(schemaInput)
	//const { lines } = await quicktype({ lang: "java", inputData, rendererOptions: { 'justTypes': 'true', 'packageName': schemaName} });
	const { lines } = await quicktype({ lang: "typescript", inputData });
	fs.writeFileSync(schemaPath, lines.join("\n"));
}
module.exports = {
	'generate:after': async (generator) => {
		const allMessages = generator.asyncapi.allMessages();
		for (let [messageId, message] of allMessages) {
			const payloadSchema = message.payload();
			if(payloadSchema.type()+"" != "null"){
				const filepath = Path.join(generator.targetDir, "src/messages/", filters.pascalCase(messageId)+".ts");
				await genSchema(filepath, messageId, message.payload());
			}
		}
		// const allSchemas = generator.asyncapi.allSchemas();
		// const objectMap = {};
		// allSchemas.forEach((schema, schemaId) => { if (schema.type() === 'object') objectMap[schemaId] = schema; });
		// for (const schema in allMessages) {
		// 	if (objectMap.hasOwnProperty(schemaName)) {
		// 		const schema = objectMap[schemaName];
		// 		const filepath = Path.join(generator.targetDir, "src/messages/", schemaName+".ts");
		// 		console.log(filepath);
		// 		await genSchema(filepath, schemaName, schema);
		// 	}
		// }
	}
};
