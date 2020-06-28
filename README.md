<h1 align="center">TypeScript/Node.js NATS template</h1>
<p align="center">
  <em>This is a TypeScript/Node.js NATS template for the AsyncAPI generator.</em>
</p>

The template is based on the [nats-ts](https://github.com/nats-io/nats.ts) library and can be used as both a TypeScript and Node.js library.

## Requirements
* @asyncapi/generator v1.0.0

Install the generator through [npm or run it from docker official installer](https://github.com/asyncapi/generator#install).

## Example usage
The leading examples are both in TypeScript and in Node.js since this template can be used for both. The example code will be used later in the documentation for to explain the different  features.

### TypeScript 


### Node.js
Given any AsyncAPI file (`AsyncAPI.yml`) first generate the client with the [AsyncAPI generator](https://github.com/asyncapi/generator) such as 

```bash
ag --install --output ./nats-client ./AsyncAPI.yml @asyncapi/ts-nats-template --force-write --param "generateTestClient=true"  --param "promisifyReplyCallback=true"
```

Afterwards `cd` into the generated folder `nats-client` and run the commands `npm i` and `npm run build`. The generated NATS client is now ready to be used. To use the generated code either create a client wrapper such as the following file:

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
module.exports = natsClient
```

or use it directly where needed.

## Features
* Supports wildcard channels. AsyncAPI describes the channel path to be defined as [RFC 6570 URI](https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-channelsobject-a-channels-object). So a channel containing a wildcard needs to be defined as `smartylighting/streetlights/*`. This also works with parameters such as `smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured`, ensure to define the type of the parameter as a String if you want to use wildcards.
* Supports [test/mirror client](###test-client) for testing or other useful scenarios.
* This template can be used as a javascript library as well since the generated code works directly in node-js. Has not been tested as a pure javascript library. 

## Available events
[All the events from nats-ts](https://github.com/nats-io/nats.ts#notifications) library are supported.
### TypeScript example

### Node.js example
```js
const GeneratedClient = require("./nats-client");
const natsClient = new GeneratedClient.NatsAsyncApiClient();

//Listen for the permissionError event from the nats-ts library
natsClient.on(Nats.AvailableEvents.permissionError, (e) => {
	console.log("permissionError");
	console.log(e);
});
``` 

## Available Parameters
These are the available template parameters:
|Parameter|Type|Description|
|---|---|---|
| generateTestClient | Boolean | Use this parameter to generate the [test client](###test-client). Add the following to the CLI when generating your code `--param "generateTestClient=true"`
| promisifyReplyCallback | Boolean | Use this parameter to change from the default regular callback when using the request operation. Add the following to the CLI when generating your code `--param "promisifyReplyCallback=true"`

## Test Client
The test client is like a mirror client. It does everything the opposite, when you define a subscription operation it will generate a subscription operation in the test client. This is opposite to what the specification dictates. This client can be used to create integration tests or other useful scenarios. 

## Supported Content Types
The following payload types are supported, this is limited to the underlying NATS TypeScript library:

* For binary payloads use: `binary` content type
* For json payloads use: `json` content type
* For string payloads use: `string` content type

## Client Hooks

The generated client support custom hooks used to control the flow of information outside the generated code. The hooks can be used to alter the payload before sending or after recieving any data i.e. encrypt, compress data, etc. It is possible to register as many hooks as you want, however remember that after the first call subsequently calls will include the already changed data and not the original. Also when using these hooks you are responsible for complying with the content type for the message being changed.

These are the available hooks:
|Hookname|Callback type|Description|
|---|---|---|
| BeforeSendingData | (messageToSend: any) => any | Called before sending any data. 
| RecievedData | (receivedData: any) => any | Called after data is recieved.

### TypeScript example 
```ts
import {Hooks, BeforeSendingDataHook} from './nats-client/hooks'
Hooks.getInstance().registerBeforeSendingData((messageToSend: any) => {
	return "AlwaysThis";
});
```

### Node.js example
