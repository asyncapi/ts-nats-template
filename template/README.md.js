import { File } from '@asyncapi/generator-react-sdk';
export default function readmeFile({ asyncapi }) {
  return <File name={'README.md'}>
    {
      `
<h1 align="center">TypeScript/Node.js NATS client wrapper</h1>
<p align="center">
  <em>This is a generated TypeScript/Node.js NATS client for the application - ${asyncapi.info().title() }.</em>
</p>

**We highly suggest you do not modify this client in any way since it is build for you to re-generate it when your AsyncAPI document changes.** 

${asyncapi.info().description() || ''}

You can find the general information about the different aspects of this library by checking [the documentation folder](./docs/general.md).

An [API document](./API.md) have also been generated which contains all the possible configurations and usages this client supports.
    `
    }
  </File>;
}
