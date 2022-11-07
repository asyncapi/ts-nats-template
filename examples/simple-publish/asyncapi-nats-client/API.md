## Modules

<dl>
<dt><a href="#module_streetlightStreetlightIdCommandTurnon">streetlightStreetlightIdCommandTurnon</a></dt>
<dd><p>Module which wraps functionality for the <code>streetlight/{streetlight_id}/command/turnon</code> channel</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#NatsAsyncApiClient">NatsAsyncApiClient</a></dt>
<dd><p>NatsAsyncApiClient</p>
<p>The generated client based on your AsyncAPI document.</p>
</dd>
<dt><a href="#NatsAsyncApiTestClient">NatsAsyncApiTestClient</a></dt>
<dd><p>NatsAsyncApiTestClient</p>
<p>The test/mirror client which is the reverse to the normal NatsAsyncApiClient.</p>
</dd>
</dl>

<a name="module_streetlightStreetlightIdCommandTurnon"></a>

## streetlightStreetlightIdCommandTurnon
Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel


* [streetlightStreetlightIdCommandTurnon](#module_streetlightStreetlightIdCommandTurnon)
    * [~publish(message, nc, codec, streetlight_id, options)](#module_streetlightStreetlightIdCommandTurnon..publish)
    * [~jetStreamPublish(message, js, codec, streetlight_id, options)](#module_streetlightStreetlightIdCommandTurnon..jetStreamPublish)

<a name="module_streetlightStreetlightIdCommandTurnon..publish"></a>

### streetlightStreetlightIdCommandTurnon~publish(message, nc, codec, streetlight_id, options)
Internal functionality to publish message to channel
streetlight/{streetlight_id}/command/turnon

**Kind**: inner method of [<code>streetlightStreetlightIdCommandTurnon</code>](#module_streetlightStreetlightIdCommandTurnon)  

| Param | Description |
| --- | --- |
| message | to publish |
| nc | to publish with |
| codec | used to convert messages |
| streetlight_id | parameter to use in topic |
| options | to publish with |

<a name="module_streetlightStreetlightIdCommandTurnon..jetStreamPublish"></a>

### streetlightStreetlightIdCommandTurnon~jetStreamPublish(message, js, codec, streetlight_id, options)
Internal functionality to publish message to jetstream channel
streetlight/{streetlight_id}/command/turnon

**Kind**: inner method of [<code>streetlightStreetlightIdCommandTurnon</code>](#module_streetlightStreetlightIdCommandTurnon)  

| Param | Description |
| --- | --- |
| message | to publish |
| js | to publish with |
| codec | used to convert messages |
| streetlight_id | parameter to use in topic |
| options | to publish with |

<a name="NatsAsyncApiClient"></a>

## NatsAsyncApiClient
NatsAsyncApiClient

The generated client based on your AsyncAPI document.

**Kind**: global class  

* [NatsAsyncApiClient](#NatsAsyncApiClient)
    * [.connect(options)](#NatsAsyncApiClient+connect)
    * [.disconnect()](#NatsAsyncApiClient+disconnect)
    * [.isClosed()](#NatsAsyncApiClient+isClosed)
    * [.connectWithUserCreds(userCreds, options)](#NatsAsyncApiClient+connectWithUserCreds)
    * [.connectWithUserPass(user, pass, options)](#NatsAsyncApiClient+connectWithUserPass)
    * [.connectToHost(host, options)](#NatsAsyncApiClient+connectToHost)
    * [.connectToLocal()](#NatsAsyncApiClient+connectToLocal)
    * [.publishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id)](#NatsAsyncApiClient+publishToStreetlightStreetlightIdCommandTurnon)
    * [.jetStreamPublishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id)](#NatsAsyncApiClient+jetStreamPublishToStreetlightStreetlightIdCommandTurnon)

<a name="NatsAsyncApiClient+connect"></a>

### natsAsyncApiClient.connect(options)
Try to connect to the NATS server with the different payloads.

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| options | to use, payload is omitted if sat in the AsyncAPI document. |

<a name="NatsAsyncApiClient+disconnect"></a>

### natsAsyncApiClient.disconnect()
Disconnect all clients from the server

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  
<a name="NatsAsyncApiClient+isClosed"></a>

### natsAsyncApiClient.isClosed()
Returns whether or not any of the clients are closed

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  
<a name="NatsAsyncApiClient+connectWithUserCreds"></a>

### natsAsyncApiClient.connectWithUserCreds(userCreds, options)
Try to connect to the NATS server with user credentials

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| userCreds | to use |
| options | to connect with |

<a name="NatsAsyncApiClient+connectWithUserPass"></a>

### natsAsyncApiClient.connectWithUserPass(user, pass, options)
Try to connect to the NATS server with user and password

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| user | username to use |
| pass | password to use |
| options | to connect with |

<a name="NatsAsyncApiClient+connectToHost"></a>

### natsAsyncApiClient.connectToHost(host, options)
Try to connect to the NATS server which has no authentication

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| host | to connect to |
| options | to connect with |

<a name="NatsAsyncApiClient+connectToLocal"></a>

### natsAsyncApiClient.connectToLocal()
Connects the client to the AsyncAPI server called local.
Local server used during development and testing

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  
<a name="NatsAsyncApiClient+publishToStreetlightStreetlightIdCommandTurnon"></a>

### natsAsyncApiClient.publishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id)
Publish to the `streetlight/{streetlight_id}/command/turnon` channel

Channel for the turn on command which should turn on the streetlight

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| message | to publish |
| streetlight_id | parameter to use in topic |

<a name="NatsAsyncApiClient+jetStreamPublishToStreetlightStreetlightIdCommandTurnon"></a>

### natsAsyncApiClient.jetStreamPublishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id)
Publish to the `streetlight/{streetlight_id}/command/turnon` jetstream channel

Channel for the turn on command which should turn on the streetlight

**Kind**: instance method of [<code>NatsAsyncApiClient</code>](#NatsAsyncApiClient)  

| Param | Description |
| --- | --- |
| message | to publish |
| streetlight_id | parameter to use in topic |

<a name="NatsAsyncApiTestClient"></a>

## NatsAsyncApiTestClient
NatsAsyncApiTestClient

The test/mirror client which is the reverse to the normal NatsAsyncApiClient.

**Kind**: global class  

* [NatsAsyncApiTestClient](#NatsAsyncApiTestClient)
    * [.connect(options)](#NatsAsyncApiTestClient+connect)
    * [.disconnect()](#NatsAsyncApiTestClient+disconnect)
    * [.isClosed()](#NatsAsyncApiTestClient+isClosed)
    * [.connectWithUserCreds(userCreds, options)](#NatsAsyncApiTestClient+connectWithUserCreds)
    * [.connectWithUserPass(user, pass, options)](#NatsAsyncApiTestClient+connectWithUserPass)
    * [.connectToHost(host, options)](#NatsAsyncApiTestClient+connectToHost)
    * [.connectToLocal()](#NatsAsyncApiTestClient+connectToLocal)
    * [.subscribeToStreetlightStreetlightIdCommandTurnon(onDataCallback, streetlight_id, flush, options)](#NatsAsyncApiTestClient+subscribeToStreetlightStreetlightIdCommandTurnon)

<a name="NatsAsyncApiTestClient+connect"></a>

### natsAsyncApiTestClient.connect(options)
Try to connect to the NATS server with the different payloads.

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  

| Param | Description |
| --- | --- |
| options | to use, payload is omitted if sat in the AsyncAPI document. |

<a name="NatsAsyncApiTestClient+disconnect"></a>

### natsAsyncApiTestClient.disconnect()
Disconnect all clients from the server

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  
<a name="NatsAsyncApiTestClient+isClosed"></a>

### natsAsyncApiTestClient.isClosed()
Returns whether or not any of the clients are closed

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  
<a name="NatsAsyncApiTestClient+connectWithUserCreds"></a>

### natsAsyncApiTestClient.connectWithUserCreds(userCreds, options)
Try to connect to the NATS server with user credentials

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  

| Param | Description |
| --- | --- |
| userCreds | to use |
| options | to connect with |

<a name="NatsAsyncApiTestClient+connectWithUserPass"></a>

### natsAsyncApiTestClient.connectWithUserPass(user, pass, options)
Try to connect to the NATS server with user and password

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  

| Param | Description |
| --- | --- |
| user | username to use |
| pass | password to use |
| options | to connect with |

<a name="NatsAsyncApiTestClient+connectToHost"></a>

### natsAsyncApiTestClient.connectToHost(host, options)
Try to connect to the NATS server which has no authentication

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  

| Param | Description |
| --- | --- |
| host | to connect to |
| options | to connect with |

<a name="NatsAsyncApiTestClient+connectToLocal"></a>

### natsAsyncApiTestClient.connectToLocal()
Connects the client to the AsyncAPI server called local.
Local server used during development and testing

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  
<a name="NatsAsyncApiTestClient+subscribeToStreetlightStreetlightIdCommandTurnon"></a>

### natsAsyncApiTestClient.subscribeToStreetlightStreetlightIdCommandTurnon(onDataCallback, streetlight_id, flush, options)
Subscribe to the `streetlight/{streetlight_id}/command/turnon`

Channel for the turn on command which should turn on the streetlight

**Kind**: instance method of [<code>NatsAsyncApiTestClient</code>](#NatsAsyncApiTestClient)  

| Param | Description |
| --- | --- |
| onDataCallback | to call when messages are received |
| streetlight_id | parameter to use in topic |
| flush | ensure client is force flushed after subscribing |
| options | to subscribe with, bindings from the AsyncAPI document overwrite these if specified |

