/* eslint-disable security/detect-non-literal-fs-filename */
/**
 * Small script that generate code for the examples.
 * 
 * This script is necessary to provide cross platform support with windows.
 */

const fs = require('fs');
const path = require('path');
const examplePath = path.resolve(__dirname, '..', 'examples');
const util = require('util');
// eslint-disable-next-line security/detect-child-process
const exec = util.promisify(require('child_process').exec);

// 'linux' on Linux
// 'win32' on Windows (32-bit / 64-bit)
// 'darwin' on OSX
const os = require('os');
const platform = os.platform();

const promises = fs.readdirSync(examplePath)
  .map((file) => { return path.resolve(examplePath, file); })
  .filter((exampleDir) => { return fs.lstatSync(exampleDir).isDirectory(); })
  .map((exampleDir) => {
    let command = 'generate:client';
    if (platform === 'win32') {
      command += ':windows';
    }
    const generatedLibraryPath = path.resolve(exampleDir, 'asyncapi-nats-client');
    if (fs.existsSync(generatedLibraryPath)) {
      fs.rmSync(generatedLibraryPath, {
        recursive: true,
        force: true
      });
    }
    return exec(`cd ${exampleDir} && npm run ${command} && npm i`, { stdio: 'inherit', timeout: 1000 * 60 * 5 });
  });
Promise.all(promises);
