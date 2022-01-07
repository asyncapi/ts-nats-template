<h1 align="center">TypeScript/Node.js NATS template</h1>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<p align="center">
  <em>This is a TypeScript/Node.js NATS template for the AsyncAPI generator.</em>
</p>

This template is for generating a TypeScript/Node.js wrapper for the NATS client based on your AsyncAPI document. The template is based on the [nats.js](https://github.com/nats-io/nats.js) library and can be used as both a TypeScript and Node.js library. 

Have you found a bug or have an idea for improvement? Feel free to contribute! See [the contribution guidelines](#Contributing) for how to do so.

# How to use
Example use-cases can be found under [examples](./examples).

Information about the generated files and a description can be found under [the documentation folder](./docs/general.md).

## Requirements
* @asyncapi/generator < v2.0.0 >v1.1.1

Install the generator through [npm or run it from docker official installer](https://github.com/asyncapi/generator#install).

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

Before contributing, please read the [CONTRIBUTING](CONTRIBUTING.md) document.

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="#maintenance-jonaslagoni" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/ts-nats-template/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/ts-nats-template/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/ts-nats-template/commits?author=jonaslagoni" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://www.fmvilas.com"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://nats.io"><img src="https://avatars.githubusercontent.com/u/11180189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Colin Sullivan</b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3AColinSullivan1" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/aricart"><img src="https://avatars.githubusercontent.com/u/1032976?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alberto Ricart</b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Aaricart" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://www.alejandraquetzalli.com"><img src="https://avatars.githubusercontent.com/u/19964402?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alejandra Quetzalli </b></sub></a><br /><a href="https://github.com/asyncapi/ts-nats-template/pulls?q=is%3Apr+reviewed-by%3Aalequetzalli" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->