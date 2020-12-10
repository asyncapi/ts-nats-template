const filters = require("../filters/all")

/**
 * Change the filenames of templates files to match the rest.
 */
module.exports = {
	'setFileTemplateName': (generator, hookArguments) => {
		const currentFilename = hookArguments.originalFilename;
		let newFilename = filters.pascalCase(currentFilename)
		return newFilename
	}
};