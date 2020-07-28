<h1 align="center">TypeScript/Node.js NATS template</h1>
<p align="center">
  <em>This is a TypeScript/Node.js NATS template for the AsyncAPI generator.</em>
</p>

This template is for generating a TypeScript/Node.js NATS client based on an AsyncAPI document. The template is based on the [nats-ts](https://github.com/nats-io/nats.ts) library and can be used as both a TypeScript and Node.js library. 

# How to use
Example generations can be found under [examples](./examples) which includes [publish and subscribe](./examples/publish%20subscribe) example as well as [request and reply](./examples/request%20reply).
## Requirements
* @asyncapi/generator <= v1.0.0-rc.5 

Install the generator through [npm or run it from docker official installer](https://github.com/asyncapi/generator#install).

## Example usage
The leading examples are both in TypeScript and in Node.js since this template can be used for both. The example code will be used later in the documentation for to explain the different features.

Given any AsyncAPI file (`AsyncAPI.yml`) first generate the client with the [AsyncAPI generator](https://github.com/asyncapi/generator) such as 
```bash
ag --install --output ./nats-client ./AsyncAPI.yml @asyncapi/ts-nats-template --force-write --param "generateTestClient=true"  --param "promisifyReplyCallback=true"
```

Afterward, `cd` into the generated folder `nats-client` and run the commands `npm i` and `npm run build`. The generated NATS client is now ready to be used in either TypeScript or Node.js.

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

# Features
* Supports wildcard channels. AsyncAPI describes the channel path to be defined as [RFC 6570 URI](https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-channelsobject-a-channels-object). So a channel containing a wildcard needs to be defined as `smartylighting/streetlights/*`. This also works with parameters such as `smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured`, ensure to define the type of the parameter as a String if you want to use wildcards.
* Supports [test/mirror client](#test-client) for testing or other useful scenarios.
* This template can be used as a javascript library as well since the generated code works directly in Node.js.
* This template uses [quicktype](https://quicktype.io/) to generate the corresponding message payloads.

# Restrictions 
* Empty objects are not supported, use `null` types instead.
* This template has not been tested with payloads with different specs other than JSON Schema draft 7.

# Connection options
Currently the generated client offers 4 standard methods of connecting to your NATS server `connectWithUserCreds`, `connectWithUserPass`, `connectToHost` and `connectWithNkey`. If you need something customized use the standard `connect` method with your custom options. Currently, the template does not care which security details you have defined in your AsyncAPI document. 

# Available events
The generated client can emit multiple events, all of these are directly from the [nats-ts](https://github.com/nats-io/nats.ts#notifications) library. Where the errors are wrapped in a custom `NatsTypescriptTemplateError` type.

## TypeScript example
```js
import {AvailableEvents, NatsAsyncApiClient, NatsTypescriptTemplateError, Client, ServerInfo, ServersChangedEvent, SubEvent} from "nats-client";
const natsClient = new NatsAsyncApiClient();

natsClient.on(AvailableEvents.permissionError, (e: NatsTypescriptTemplateError) => {
  console.log("NatsAsyncApiClient permissionError");
  console.log(e);
});
natsClient.on(AvailableEvents.close, (e: NatsTypescriptTemplateError) => {
  console.log("NatsAsyncApiClient close");
  console.log(e);
});
natsClient.on(AvailableEvents.connect, (connection: Client, serverURL: string, info: ServerInfo) => {
  console.log("NatsAsyncApiTestClient connect");
  console.log({connection, serverURL, info});
});
natsClient.on(AvailableEvents.connecting, (serverURL: string) => {
  console.log("NatsAsyncApiClient connecting");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.disconnect, (serverURL: string) => {
  console.log("NatsAsyncApiClient disconnect");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.error, (e: NatsTypescriptTemplateError) => {
  console.log("NatsAsyncApiClient error");
  console.log(e);
});
natsClient.on(AvailableEvents.pingcount, () => {
  console.log("NatsAsyncApiClient pingcount");
});
natsClient.on(AvailableEvents.pingtimer, () => {
  console.log("NatsAsyncApiClient pingtimer");
});
natsClient.on(AvailableEvents.reconnect, (connection: Client, serverURL: string, info: ServerInfo) => {
  console.log("NatsAsyncApiClient reconnect");
  console.log({connection, serverURL, info});
});
natsClient.on(AvailableEvents.reconnecting, (serverURL: string) => {
  console.log("NatsAsyncApiClient reconnecting");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.serversChanged, (e: ServersChangedEvent) => {
  console.log("NatsAsyncApiClient serversChanged");
  console.log(e);
});
natsClient.on(AvailableEvents.subscribe, (e: SubEvent) => {
  console.log("NatsAsyncApiClient subscribe");
  console.log(e);
});
natsClient.on(AvailableEvents.unsubscribe, (e: SubEvent) => {
  console.log("NatsAsyncApiClient unsubscribe");
  console.log(e);
});
natsClient.on(AvailableEvents.yield, () => {
  console.log("NatsAsyncApiClient yield");
});
``` 
## Node.js example
```js
const {AvailableEvents, NatsAsyncApiClient} = require("nats-client");
const natsClient = new NatsAsyncApiClient();
natsClient.on(AvailableEvents.permissionError, (e) => {
  console.log("NatsAsyncApiClient permissionError");
  console.log(e);
});
natsClient.on(AvailableEvents.close, (e) => {
  console.log("NatsAsyncApiClient close");
  console.log(e);
});
natsTestClient.on(AvailableEvents.connect, async (connection, serverURL, info) => {
  console.log("NatsAsyncApiTestClient connect");
  console.log({connection, serverURL, info});
});
natsClient.on(AvailableEvents.connect, (connection, serverURL, info) => {
  console.log("NatsAsyncApiClient connect");
  console.log({connection, serverURL, info});
});
natsClient.on(AvailableEvents.connecting, (serverURL) => {
  console.log("NatsAsyncApiClient connecting");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.disconnect, (serverURL) => {
  console.log("NatsAsyncApiClient disconnect");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.error, (e) => {
  console.log("NatsAsyncApiClient error");
  console.log(e);
});
natsClient.on(AvailableEvents.pingcount, () => {
  console.log("NatsAsyncApiClient pingcount");
});
natsClient.on(AvailableEvents.pingtimer, () => {
  console.log("NatsAsyncApiClient pingtimer");
});
natsClient.on(AvailableEvents.reconnect, (connection, serverURL, info) => {
  console.log("NatsAsyncApiClient reconnect");
  console.log({connection, serverURL, info});
});
natsClient.on(AvailableEvents.reconnecting, (serverURL) => {
  console.log("NatsAsyncApiClient reconnecting");
  console.log(serverURL);
});
natsClient.on(AvailableEvents.serversChanged, (e) => {
  console.log("NatsAsyncApiClient serversChanged");
  console.log(e);
});
natsClient.on(AvailableEvents.subscribe, (e) => {
  console.log("NatsAsyncApiClient subscribe");
  console.log(e);
});
natsClient.on(AvailableEvents.unsubscribe, (e) => {
  console.log("NatsAsyncApiClient unsubscribe");
  console.log(e);
});
natsClient.on(AvailableEvents.yield, () => {
  console.log("NatsAsyncApiClient yield");
});
``` 

# Template Parameters
These are the available template parameters:
|Parameter|Type|Description|
|---|---|---|
| generateTestClient | Boolean | Use this parameter to generate the [test client](#test-client). Add the following to the CLI when generating your code `--param "generateTestClient=true"`
| promisifyReplyCallback | Boolean | Use this parameter to change from the default regular callback when using the request operation. Add the following to the CLI when generating your code `--param "promisifyReplyCallback=true"`

# Test Client
The test client is like a mirror client. It does everything the opposite, when you define a subscription operation it will generate a subscription operation in the test client. This is opposite to what the specification dictates. This client can be used to create integration tests or other useful scenarios.

# Supported Content Types
The following payload types are supported, this is limited to the underlying NATS TypeScript library:

* For binary payloads use: `binary` content type
* For json payloads use: `json` content type
* For string payloads use: `string` content type

# Client Hooks

Sometimes to you want to change the data before sending or reciving it. For this purpose hooks has been added to control the flow of information outside the generated code. The hooks can be used to alter the payload before sending or after recieving any data i.e. encrypt, compress data, etc. It is possible to register as many hooks as you want however there are certain restrictions, see [hook restrictions](#Hook-restrictions).


These are the available hooks:
|Hookname|Callback type|Description|
|---|---|---|
| BeforeSendingData | (messageToSend: any) => any | Called before sending any data. 
| receivedData | (receivedData: any) => any | Hook is called after data is received before the client tries to peace the message back together.

## Node.js example
This example uses the msgpack library to encode and decode the message before sending and receiving data.
```js
const {AvailableEvents, NatsAsyncApiClient, Hooks} = require("nats-client");
const natsClient = new NatsAsyncApiClient();
const msgpack = require("msgpack-lite");
function encode(msg){
  console.log("encode");
  console.log(msg);
  // encode from JS Object to MessagePack (Buffer)
  return msgpack.encode(msg);
}
function decode(msg){
  // decode from MessagePack (Buffer) to JS Object
  console.log("Decoding");
  console.log(msg);
  return msgpack.decode(msg.data); // => {"foo": "bar"}
}
Hooks.getInstance().registerBeforeSendingData(encode);
Hooks.getInstance().registerreceivedData(decode);
``` 
## Hook restrictions
There are different hook restrictions based on the payload type.

### Binary payloads
The first hook always receives the message type as is. Any intermediary hooks can return any type of your choosing. The last hook is required to return a buffer to transmit.

### JSON payloads
The first hook always receives the message type as is. Any intermediary hooks can return any type of your choosing. The last hook is required to return the correct message type.

### String payloads
The first hook always receives the message type as is. Any intermediary hooks can return any type of your choosing. The last hook is required to return a string representation of the message.
