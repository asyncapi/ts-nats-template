const filters = require("../filters/all")

module.exports = {
	'setFileTemplateName': (generator, hookArguments) => {
		const currentFilename = hookArguments.originalFilename;
		let newFilename = filters.pascalCase(currentFilename)
		return newFilename
	}
};