const {TypeScriptGenerator} = require('@asyncapi/generator-model-sdk');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
function fileName(string) {
  string = string.replace(/\W/g, '');
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const preset = {
  class: {
    async self({ renderer, model }) {
      const content = [
        await renderer.renderProperties(),
        await renderer.runCtorPreset(),
        await renderer.renderAccessors(),
        await renderer.runAdditionalContentPreset(),
      ];
      const formattedName = fileName(model.$id);
      return `export class ${formattedName} {
${renderer.indent(renderer.renderBlock(content, 2))}
}`;
    }
  }
}
/**
 * Use quicktype to generate messages with their payload.
 */
module.exports = {
  'generate:after': async (generator) => {
    const typescriptGenerator = new TypeScriptGenerator({presets: [preset]});
    const generatedModels = await typescriptGenerator.generate(generator.asyncapi);
    for (const generatedModel of generatedModels) {
      
      const targetDir = Path.join(generator.targetDir, 'src/schemas/');
      await fs.promises
        .mkdir(targetDir, { recursive: true })
        .catch(console.error);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(
        Path.join(
          targetDir,
          `${fileName(generatedModel.modelName)}.ts`
        ),
        generatedModel.result
      );
    }
  }
};
