# Hooks

Sometimes to you want to change the data before sending or receiving it. For this purpose hooks has been added to control the flow of information outside the generated code. The hooks can be used to alter the payload before sending or after receiving any data i.e. encrypt, compress data, etc. It is possible to register as many hooks as you want however there are certain restrictions, see [hook restrictions](#Hook-restrictions).

These are the available hooks:

|Hook name|Callback type|Description|
|---|---|---|
| BeforeSendingData | (messageToSend: any) => any | Called before sending any data. 
| ReceivedData | (ReceivedData: any) => any | Hook is called after data is received before the client tries to peace the message back together.

## Node.js example
This example uses the `msgpack` library to encode and decode the message before sending and receiving data. `nats-client` is the generated client wrapper.

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
Hooks.getInstance().registerReceivedData(decode);
``` 

## Hook restrictions
There are different hook restrictions based on the payload type.

### Binary payloads
If you only have 1 hook then you must ensure that it returns a buffer.

If you have multiple hooks then the following applies: The first hook always receives the message type as is. Any intermediary hooks receives what the last hook returned and can return any type of your choosing. The last hook is required to return a buffer to transmit.

### JSON payloads
If you only have 1 hook then you must ensure that it returns a JSON object.

If you have multiple hooks then the following applies: The first hook always receives the message type as is. Any intermediary hooks can return any type of your choosing. The last hook is required to return a JSON object.

### String payloads
If you only have 1 hook then you must ensure that it returns a string.

If you have multiple hooks then the following applies: The first hook always receives the message type as is. Any intermediary hooks can return any type of your choosing. The last hook is required to return a string representation of the message.
