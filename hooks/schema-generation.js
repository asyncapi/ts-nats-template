const {TypeScriptGenerator, FormatHelpers} = require('@asyncapi/generator-model-sdk');
const fs = require('fs');
const Path = require('path');

const preset = {
  interface: {
    async property({ renderer, model, propertyName, property }) {
      const signature = renderer.renderTypeSignature(property, { isRequired: model.isRequired(propertyName) });
      return `${propertyName}${signature};`;
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
