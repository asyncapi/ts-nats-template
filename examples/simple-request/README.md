# Request example

A basic example showing how to define an AsyncAPI channel as a request operation, and how to use the generated library.

It contains the following files:
- `asyncapi.json` is the AsyncAPI document for the application.
- `index.ts` contains a usage example of the generated library that sends a request.
- `index.spec.ts` tests that the usage example actually sends the request by setting up a reply handler, by using the mirror client.
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

To test this example, run:

```sh
npm i && npm run test
```

If you are on Windows, use the `test:windows` script instead:

```sh
npm i && npm run test:windows
```

## How to run this example

Before running this example, make sure you set up a reply handler so that when the example is making the request, it will receive a reply.

To run this example, use:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```
