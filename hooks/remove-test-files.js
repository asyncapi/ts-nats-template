const fs = require('fs');
const Path = require('path');

const deleteFolderRecursive = function(path) {
	if (fs.existsSync(path) && path !== "/") {
	  fs.readdirSync(path).forEach((file, index) => {
		const curPath = Path.join(path, file);
		if (fs.lstatSync(curPath).isDirectory()) { // recurse
		  deleteFolderRecursive(curPath);
		} else { // delete file
		  fs.unlinkSync(curPath);
		}
	  });
	  fs.rmdirSync(path);
	}
  };
module.exports = {
	'generate:after': (generator) => {
		if(generator.targetDir && generator.templateParams && !generator.templateParams.generateTestFiles){
			pathToTests = Path.resolve(generator.targetDir, "src/tests/")
			deleteFolderRecursive(pathToTests)
		}
	}
};
