const filters = require("../filters/all")
module.exports = register => {
	register('generate:changeFilename', (generator, hookArguments) => {
		const currentFilename = hookArguments.originalFilename;
		let newFilename = filters.pascalCase(currentFilename)
		return newFilename
	});
};