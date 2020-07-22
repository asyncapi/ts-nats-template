const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {string} dir to recursively rename files with njk extension 
 */
var renameAllSync = function(dir) {
	files = fs.readdirSync(dir);
	files.forEach(function(file) {
		let filepath = path.resolve(dir, file);
		if (fs.statSync(filepath).isDirectory()) {
			renameAllSync(filepath);
		} else if (
			path.extname(filepath) === '.njk' &&
			!dir.includes('node_modules')
		) {
			let newName = path.basename(filepath, '.njk');
			let newPath = path.resolve(dir, newName);
			fs.renameSync(filepath, newPath);
		}
	});
};

/**
 * Rename all the njk files to get the correct extensions
 */
module.exports = {
	'generate:after': (generator) => {
		renameAllSync(path.resolve(generator.targetDir));
	}
};
