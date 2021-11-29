
import { kebabCase } from '../utils/index';
import { File } from '@asyncapi/generator-react-sdk';

export default function packageFile({ asyncapi }) {
  const packageJSON = {
    name: 'NatsTSclient',
    description: '',
    version: '0.0.1',
    main: 'lib/index.js',
    types: 'lib/index.d.ts',
    scripts: {
      build: 'tsc && npm run docs',
      'test:integration': 'mocha -r ts-node/register tests/integration/**/*.spec.ts --exit --timeout 10000',
      docs: 'npm run docs:markdown',
      'docs:markdown': 'jsdoc2md lib/index.js -f lib/**/*.js > API.md'
    },
    dependencies: {
      nats: '^2.4.0'
    },
    devDependencies: {
      'ts-node': '^8.10.2',
      '@types/mocha': '^8.0.4',
      '@types/chai': '^4.2.14',
      '@types/node': '13.9.5',
      '@types/klaw-sync': '^6.0.0',
      chai: '^4.2.0',
      mocha: '^8.2.1',
      'jsdoc-to-markdown': '^6.0.1',
      typescript: '3.4.3'
    }
  };
  if (asyncapi.info().title()) {
    packageJSON.name = kebabCase(asyncapi.info().title());
  }
  if (asyncapi.info().version()) {
    packageJSON.version = asyncapi.info().version();
  }
  if (asyncapi.info().description()) {
    packageJSON.description = asyncapi.info().description();
  }

  return <File name={'package.json'}>
    {JSON.stringify(packageJSON, null, 2)}
  </File>;
}
