# Available events
The generated client can emit multiple events, all of these are re-emitted from the [nats-ts](https://github.com/nats-io/nats.ts#notifications) library. 

In the following examples `nats-client` is the generated client wrapper.

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