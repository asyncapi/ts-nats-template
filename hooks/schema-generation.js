const {TypeScriptGenerator, FormatHelpers} = require('@asyncapi/generator-model-sdk');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');

/**
 * Use AsyncAPI generator model gen library to generate all schemas.
 */
module.exports = {
  'generate:after': async (generator) => {
    const typescriptGenerator = new TypeScriptGenerator({modelType: "interface"});
    const generatedModels = await typescriptGenerator.generate(generator.asyncapi);
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
