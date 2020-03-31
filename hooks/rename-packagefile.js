const fs = require('fs');
const path = require('path');

module.exports = register => {
	register('generate:after', generator => {
		fs.renameSync(
			path.resolve(generator.targetDir, './__package.json'),
			path.resolve(generator.targetDir, './package.json')
		);
	});
};
