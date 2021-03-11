<h1 align="center">TypeScript/Node.js NATS template</h1>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<p align="center">
  <em>This is a TypeScript/Node.js NATS template for the AsyncAPI generator.</em>
</p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-BADGE:END --> 

This template is for generating a TypeScript/Node.js wrapper for the NATS client based on your AsyncAPI document. The template is based on the [nats-ts](https://github.com/nats-io/nats.ts) library and can be used as both a TypeScript and Node.js library. 

Have you found a bug or have an idea for improvement? Feel free to contribute! See [the contribution guidelines](#Contributing) how to do so.

# How to use
Example generations can be found under [examples](./examples) which includes [publish and subscribe](./examples/publish%20subscribe) example as well as [request and reply](./examples/request%20reply).

Information about the generated files and a description can be found under [the documentation folder](./docs/general.md).
## Requirements
* @asyncapi/generator < v2.0.0 >v1.1.1

Install the generator through [npm or run it from docker official installer](https://github.com/asyncapi/generator#install).

## Example usage
The leading examples are both in TypeScript and in Node.js since this template can be used for both. The example code will be used later in the documentation to explain the different features.

Given any AsyncAPI file (`AsyncAPI.yml`) first generate the client with the [AsyncAPI generator](https://github.com/asyncapi/generator) such as 
```bash
ag --install --output ./nats-client ./AsyncAPI.yml @asyncapi/ts-nats-template --param "generateTestClient=true"  --param "promisifyReplyCallback=true"
```

Afterward, go into the generated folder `nats-client` and run the commands `npm i` and `npm run build`. The generated NATS client is now ready to be used in either TypeScript or Node.js.

### TypeScript 

```js
import * as GeneratedClient from "./nats-client";
const natsClient = new GeneratedClient.NatsAsyncApiClient();
async function connect(){
  try{
    await natsClient.connect({url: "nats://demo.nats.io:4222", reconnectTimeWait: 1000, reconnect: true, maxReconnectAttempts: -1});
  }catch(e){
    console.log(e);
  }
}
connect();
```

### Node.js
```js
const GeneratedClient = require("./nats-client");
const natsClient = new GeneratedClient.NatsAsyncApiClient();
async function connect(){
  try{
    await natsClient.connect({url: "nats://demo.nats.io:4222", reconnectTimeWait: 1000, reconnect: true, maxReconnectAttempts: -1});
  }catch(e){
    console.log(e);
  }
}
connect();
```

## Template Parameters
These are the available template parameters:
|Parameter|Type|Description|
|---|---|---|
| generateTestClient | Boolean | Use this parameter to generate the [test client](#test-client). Add the following to the CLI when generating your code `--param "generateTestClient=true"`
| promisifyReplyCallback | Boolean | Use this parameter to change from the default regular callback when using the request operation. Add the following to the CLI when generating your code `--param "promisifyReplyCallback=true"`

## Features
* Supports wildcard channels. AsyncAPI describes the channel path to be defined as [RFC 6570 URI](https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-channelsobject-a-channels-object). So a channel containing a wildcard needs to be defined with parameters such as `smartylighting/streetlights/{wildcard}`.
* Supports [test/mirror client](./docs/general.md#test-client) for testing or other useful scenarios.
* This template can be used as a NodeJS library.
* Generates payload models using the [AsyncAPI model generation library](https://github.com/asyncapi/generator-model-sdk). 

## Restrictions 
* Empty objects are not supported, use `null` types instead.

# Contributing

Before contributing please read the [CONTRIBUTING](CONTRIBUTING.md) document.

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!