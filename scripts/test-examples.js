/**
 * Small script that tests the examples.
 * 
 * This script is necessary to provide cross platform support with windows.
 */

const fs = require('fs');
const path = require('path');
const examplePath = path.resolve(__dirname, '../examples/');
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(examplePath)
  .map((file) => {return path.resolve(examplePath, file);})
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  .filter((exampleDir) => {return fs.lstatSync(exampleDir).isDirectory();})
  .forEach((exampleDir) => {
    execSync(`npm run test --prefix ${exampleDir}`);
  });
