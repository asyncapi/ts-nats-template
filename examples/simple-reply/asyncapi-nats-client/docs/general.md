# General
These are all the general information about the generated client wrapper and what is available.

## Connection options
The generated client offers some connection functions

4 standard methods of connecting to your NATS server `connectWithUserCreds`, `connectWithUserPass` and `connectToHost`. If you need something customized use the standard `connect` method with your custom options. Currently, the template does not care which security details you have defined in your AsyncAPI document or which servers are listed. 

## Test Client
The test client is like a mirror client. It does everything the opposite, when you define a subscription operation it will generate a subscription operation in the test client. This is opposite to what the specification dictates. This client can be used to create integration tests or in other useful scenarios.

## Supported Content Types
The following payload types are supported, this is limited to the underlying NATS TypeScript library:

* For JSON payloads use: `application/json` content type, this is default if nothing is specified
* For string payloads use: `text/plain` content type

If any other formats are used, it will require you to manually create this codec.