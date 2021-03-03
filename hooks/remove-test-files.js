// detect-non-literal-fs-filename provides false-positives
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const Path = require('path');

/**
 * Remove a folder recursively.
 * 
 * @param {string} path to recursively remove 
 */
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path) && path !== '/') {
    fs.readdirSync(path).forEach((file) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

/**
 * Since we cannot have a condition on a template whether to generate something 
 * or not we have to remove the test client if its not specified. 
 */
module.exports = {
  'generate:after': (generator) => {
    if (generator.targetDir && generator.templateParams && !generator.templateParams.generateTestClient) {
      const pathToTestClient = Path.resolve(generator.targetDir, 'src/testclient/');
      deleteFolderRecursive(pathToTestClient);
      const pathToTests = Path.resolve(generator.targetDir, 'tests/');
      deleteFolderRecursive(pathToTests);
    }
  }
};
