const {TypeScriptGenerator} = require('@asyncapi/generator-model-sdk');
const fs = require('fs');
const Path = require('path');

const _ = require('lodash');
function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Use quicktype to generate messages with their payload.
 */
module.exports = {
  'generate:after': async (generator) => {
    const typescriptGenerator = new TypeScriptGenerator();
    const generatedModels = await typescriptGenerator.generate(generator.asyncapi);
    for (const generatedModel of generatedModels) {
      
      const targetDir = Path.join(generator.targetDir, 'src/messages/');
      await fs.promises
        .mkdir(targetDir, { recursive: true })
        .catch(console.error);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(
        Path.join(
          targetDir,
          `${pascalCase(generatedModel.modelName)}.ts`
        ),
        generatedModel.result
      );
    }
  }
};
