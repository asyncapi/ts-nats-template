/**
 * Small script that generate code for the examples.
 * 
 * This script is necessary to provide cross platform support with windows.
 */

const path = require('path');
// eslint-disable-next-line security/detect-child-process
const {execSync} = require('child_process');

// 'linux' on Linux
// 'win32' on Windows (32-bit / 64-bit)
// 'darwin' on OSX
const os = require('os');
const platform = os.platform();
let command = 'generate:client';
if (platform === 'win32') {
  command += ':windows';
}

const examplePath = path.resolve(__dirname, '..', 'examples');
execSync(`find ${examplePath} -not -iwholename '${examplePath}' -maxdepth 1 -type d -exec npm run ${command} --prefix {} \\; -exec npm i --prefix {} \\;`, {stdio: 'inherit'});
