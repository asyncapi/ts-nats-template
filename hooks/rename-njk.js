const fs = require('fs');
const path = require('path');
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
module.exports = {
	'generate:after': (generator) => {
		renameAllSync(path.resolve(generator.targetDir));
	}
};
