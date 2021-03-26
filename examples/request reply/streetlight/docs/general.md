# General
These are all the general information about the generated client wrapper and what is available.

## Connection options
The generated client offers some connection functions

4 standard methods of connecting to your NATS server `connectWithUserCreds`, `connectWithUserPass`, `connectToHost` and `connectWithNkey`. If you need something customized use the standard `connect` method with your custom options. Currently, the template does not care which security details you have defined in your AsyncAPI document or which servers are listed. 

## Available events
The generated client can emit multiple events see the [events](./events.md) documentation for further details.

## Test Client
The test client is like a mirror client. It does everything the opposite, when you define a subscription operation it will generate a subscription operation in the test client. This is opposite to what the specification dictates. This client can be used to create integration tests or in other useful scenarios.

## Supported Content Types
The following payload types are supported, this is limited to the underlying NATS TypeScript library:

* For binary payloads use: `application/octet-stream` content type
* For JSON payloads use: `application/json` content type, this is default if nothing is specified
* For string payloads use: `text/plain` content type

## Client Hooks
Sometimes to you want to change the data before sending or receiving it. For this purpose hooks has been added to control the flow of information outside the generated code. 

See the [hooks](./hooks.md) documentation for further details.