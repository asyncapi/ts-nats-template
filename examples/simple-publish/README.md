# Publish example

A basic example showing how to define an AsyncAPI channel as a publish operation, and how to use the generated library.

This example contains the following files:
- `asyncapi.json` is the AsyncAPI document for the application that defines it as a publish operation.
- `index.ts` contains a usage example of the generated library that publish a message.
- `index.spec.ts` test that the usage example (`index.ts`) correctly publish a message by subscribing to the channel.
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
Before running this example, manually setup a subscription in NATS through external tooling.

To run this example, use:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```
