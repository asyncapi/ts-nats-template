/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js;

const beautifyConfig = {
  indent_size: '2',
  indent_char: ' ',
  max_preserve_newlines: '1',
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: '0',
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false
};

/**
 * Recursively beautify all files in directory
 * 
 * @param {string} dirPath to recursively beautify files in
 */
const beautifyAllOutputFiles = function(dirPath) {
  //Exclude models as some syntax ruins the code.
  if (dirPath.includes('models')) {
    console.log(dirPath);
    return;
  }
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      beautifyAllOutputFiles(filePath);
    } else {
      const fileData = fs.readFileSync(filePath);
      const beautifiedData = beautify(fileData.toString(), beautifyConfig);
      fs.writeFileSync(filePath, beautifiedData);
    } 
  });
};

/**
 * Format all source files with indentations and new lines
 */
module.exports = {
  'generate:after': (generator) => {
    let pathToDir = path.resolve(generator.targetDir, 'src');
    beautifyAllOutputFiles(pathToDir);

    pathToDir = path.resolve(generator.targetDir, 'tests');
    beautifyAllOutputFiles(pathToDir);
  }
};
