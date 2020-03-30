const fs = require('fs');
const path = require('path');

module.exports = register => {
	register('generate:after', generator => {
		fs.renameSync(
			path.resolve(generator.targetDir, './__README.md'),
			path.resolve(generator.targetDir, './README.md')
		);
	});
};
