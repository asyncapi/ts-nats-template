import { File } from '@asyncapi/generator-react-sdk';
import { TypeScriptGenerator, FormatHelpers } from '@asyncapi/modelina';

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi received from the generator.
 */

/**
 * Custom model preset to ensure property names are lower cased
 */
const preset = {
  interface: {
    async property({ renderer, model, propertyName, property }) {
      const signature = renderer.renderTypeSignature(property, { isRequired: model.isRequired(propertyName) });
      return `${propertyName}${signature};`;
    }
  }
};

/**
 * Render all schema models
 * @param {RenderArgument} param0 
 * @returns 
 */
export default async function schemaRender({ asyncapi }) {
  const typescriptGenerator = new TypeScriptGenerator({modelType: 'interface', presets: [preset]});
  const generatedModels = await typescriptGenerator.generate(asyncapi);
  const files = [];
  for (const generatedModel of generatedModels) {
    const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`;
    const fileContent = `
${generatedModel.model.getNearestDependencies().map((value) => {return FormatHelpers.toPascalCase(value);}).join('\n')}
${generatedModel.result}
    `;
    files.push(<File name={modelFileName}>{fileContent}</File>);
  }
  return files;
}

