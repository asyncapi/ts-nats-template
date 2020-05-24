<h1 align="center">Typescript NATS template</h1>
<p align="center">
  <em>This is a typescript NATS template for the AsyncAPI generator.</em>
</p>

## Requirements
* @asyncapi/generator v1.0.0+

Install the generator through [npm or run it from dockerofficial installer](https://github.com/asyncapi/generator)

## Features


## Available Parameters
These are the available parameters available when you generate code with the template:
|Parameter|Type|Description|
|---|---|---|
| generateTestClient | Boolean | Use this parameter to generate the [test client](###test-client). Add the following to the CLI when generating your code `--param "generateTestClient=true"`
| promisifyReplyCallback | Boolean | Use this parameter to change from the default regular callback when using the request operation. Add the following to the CLI when generating your code `--param "promisifyReplyCallback=true"`

## Test Client
The test client is like a mirror client. It does everything the opposite, when you define a subscription operation it will generate a subscription operation in the test client. This is opposite to what the specification dictates. This client can be used to create integration tests etc. 

## Supported Content Types
The following payload types are supported, this is limited to the underlying NATS typescript library:

* For binary payloads use: `binary` content type
* For json payloads use: `json` content type
* For string payloads use: `string` content type

## Client Hooks

The client support custom hooks used to control the flow of information outside the generated code. The hooks can be used to alter the payload before sending or after recieving any data i.e. encrypt, compress data, etc.

These are the available hooks:
|Hookname|Callback type|Description|
|---|---|---|
| BeforeSendingData | (Message: any) => new data | Called before sending any data. 
| RecievedData | (recieved data: any) => new data | Called after data is recieved.
