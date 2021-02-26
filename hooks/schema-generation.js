const {TypeScriptGenerator, FormatHelpers} = require('@asyncapi/generator-model-sdk');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
function generateValueExample(model){
  if(model.$ref !== undefined){
    return `${FormatHelpers.toPascalCase(model.$ref)}.example${FormatHelpers.toPascalCase(model.$ref)}`
  }else {
    let type = model.type;
    if(Array.isArray(model.type)){
      type = model.type[0];
    }
    switch(type){
      case 'string':
        return "test";
      case 'number': 
      case 'integer': 
        return 0;
      case 'boolean': 
        return true;
      case 'array':
        return `[${generateValueExample(model)}]`;
    }
  }
  return undefined;

}
function generateModelExample(renderer, model){
  const properties = model.properties || {};
  const content = [];

  for (const [propertyName, property] of Object.entries(properties)) {
    content.push(`${propertyName}: ${generateValueExample(property)}`);
  }

  return `${content.join(',\n')}`;
}

const preset = {
  interface: {
    async self({ renderer, model }) {
      return `
export ${await renderer.defaultSelf()}
export let example${FormatHelpers.toPascalCase(model.$id)} = {
  ${generateModelExample(renderer, model)}
}

`;

    }
  }
}
/**
 * Use AsyncAPI generator model gen library to generate all schemas.
 */
module.exports = {
  'generate:after': async (generator) => {
    const typescriptGenerator = new TypeScriptGenerator({modelType: "interface", presets: [preset]});
    const generatedModels = await typescriptGenerator.generate(generator.asyncapi);
    const targetDir = Path.join(generator.targetDir, 'src/schemas/');
    for (const generatedModel of generatedModels) {
      const fileContent = `
${generatedModel.model.getImmediateDependencies().map((value) => {return FormatHelpers.toPascalCase(value)}).join('\n')}
${generatedModel.result}
      `
      await fs.promises
        .mkdir(targetDir, { recursive: true })
        .catch(console.error);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(
        Path.join(
          targetDir,
          `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`
        ),
        fileContent
      );
    }
  }
};
