import { File } from '@asyncapi/generator-react-sdk';
import { TypeScriptGenerator, FormatHelpers, TS_COMMON_PRESET } from '@asyncapi/modelina';

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi received from the generator.
 */

/**
 * Render all schema models
 * @param {RenderArgument} param0 
 * @returns 
 */
export default async function schemaRender({ asyncapi }) {
  const typescriptGenerator = new TypeScriptGenerator({
    modelType: 'class',
    presets: [
      {
        preset: TS_COMMON_PRESET,
        options: {
          marshalling: true
        }
      }
    ]
  });
  const generatedModels = await typescriptGenerator.generateCompleteModels(asyncapi, {moduleSystem: 'ESM'});
  const files = [];
  for (const generatedModel of generatedModels) {
    const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`;
    files.push(<File name={modelFileName}>{generatedModel.result}</File>);
  }
  return files;
}

