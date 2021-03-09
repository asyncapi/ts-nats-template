/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');

/**
 * Since some docs are shared with the template repository lets copy them into the output.
 */
module.exports = {
  'generate:after': (generator) => {
    const pathToDocs = path.resolve(__dirname, '../docs/');
    const pathToGeneratedDocs = path.resolve(generator.targetDir, 'docs/');
    fs.mkdirSync(pathToGeneratedDocs, { recursive: true });
    const files = fs.readdirSync(pathToDocs);
    files.forEach((file) => {
      const source = path.join(pathToDocs, file);
      const curSource = path.join(pathToGeneratedDocs, file);
      fs.writeFileSync(curSource, fs.readFileSync(source));
    });
  }
};
