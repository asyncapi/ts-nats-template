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
      const targetDir = Path.join(generator.targetDir, 'src/schemas/');
      const imports = [];
      if (generatedModel.model.additionalProperties?.$ref) {
        const filename = FormatHelpers.toPascalCase(generatedModel.model?.additionalProperties?.$ref);
        imports.push(`imports {${filename} from './${filename}';`)
      }
      if (generatedModel.model.items?.$ref) {
        const filename = FormatHelpers.toPascalCase(generatedModel.model?.items?.$ref);
        imports.push(`imports {${filename} from './${filename}';`)
      }
      if (generatedModel.model.properties !== null && Object.keys(generatedModel.model.properties).length) {
        Object.entries(generatedModel.model.properties).forEach(([_, propertyModel]) => {
          if (propertyModel.additionalProperties?.$ref) {
            const filename = FormatHelpers.toPascalCase(propertyModel.additionalProperties?.$ref);
            imports.push(`imports {${filename} from './${filename}';`);
          }
        });
      }
      const fileContent = `
${imports.join('\n')}
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
