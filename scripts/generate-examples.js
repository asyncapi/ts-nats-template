/**
 * Small script that generate code for the examples.
 * 
 * This script is necessary to provide cross platform support with windows.
 */

const fs = require('fs');
const path = require('path');
const examplePath = path.join(__dirname, '..', 'examples');
// eslint-disable-next-line security/detect-child-process
const {execSync} = require('child_process');
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(examplePath)
  .map((file) => {return path.join(examplePath, file);})
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  .filter((exampleDir) => {return fs.lstatSync(exampleDir).isDirectory();})
  .forEach((exampleDir) => {
    execSync(`npm run generate:client --prefix ${exampleDir} && npm i --prefix ${exampleDir}`);
  });
