const quicktypeFilter = require('@lagoni/asyncapi-quicktype-filter');

/**
 * Use quicktype to generate messages with their payload.
 */
module.exports = {
  'generate:after': async (generator) => {
    const allMessages = generator.asyncapi.allMessages();
    await quicktypeFilter.generateAllMessagePayloads(
      generator.targetDir,
      {
        quicktypeLanguage: 'typescript',
        subTargetDir: 'src/messages/'
      },
      allMessages
    );
  }
};
