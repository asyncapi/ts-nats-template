# Request example

A basic example for a request handler.

It contains the following files:
- `asyncapi.json` is the AsyncAPI document for the application.
- `index.ts` contains a usage example of the generated library.
- `index.spec.ts` test that the usage example actually sends a request, by using the mirror client.
- `asyncapi-nats-client` contains the generated client.

## How to generate the client

To generate the client run the command 

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

To run this example make sure you have setup a reply handler so when the example is making the request it will receive a reply.

To run this example using:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```
