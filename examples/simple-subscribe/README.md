# Subscribe example

A basic example showing how to define an AsyncAPI channel as a subscribe operation, and how to use the generated library.

This example contains the following files:
- `asyncapi.json` is the AsyncAPI document for the application that defines it as subscribe operation.
- `index.ts` contains a usage example of the generated library that subscribe to the channel.
- `index.spec.ts` test that the usage example (`index.ts`) has set up a correct subscription by publishing to the channel over NATS.
- `asyncapi-nats-client` contains the generated client.

## How to generate the client

To generate the client, run this command:

```sh
npm run generate:client
```

If you are on Windows, use the `generate:client:windows` script instead:

```sh
npm run generate:client:windows
```

## How to test this example

To test this example use:

```sh
npm i && npm run test
```

If you are on Windows, use the `test:windows` script instead:

```sh
npm i && npm run test:windows
```

## How to run this example

To run this example, use:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```

Afterwards, manually publish a message over NATS through external tooling.