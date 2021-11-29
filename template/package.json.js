
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
      'ts-node': '^10.4.0',
      '@types/mocha': '^9.0.0',
      '@types/chai': '4.2.22',
      '@types/node': '13.9.5',
      '@types/klaw-sync': '^6.0.1',
      chai: '^4.3.4',
      mocha: '^9.1.3',
      'jsdoc-to-markdown': '^6.0.1',
      typescript: '4.5.2'
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
