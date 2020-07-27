<h1 align="center">Streetlight example</h1>
<p align="center">
  <em>Request and reply</em>
</p>


# How to run it

1. Run the docker-compose file `../docker-compose.yml` or run the NATS server your self locally on the standard port.
2. Install the dependencies `npm i`
3. Run the local test with `npm run start` 



# Description
This example contains two channels are:

`streetlight/{streetlight_id}/command/turnon` which are for replying to the command `turnon`. The generated client interprets this as the NATS topic `streetlight.{streetlight_id}.command.turnon`. The `{streetlight_id}` is the channel parameter which are not realized before actually subscribing to anything. When a message is received on channel `streetlight.1.command.turnon` it can automatically interpret what the `streetlight_id` parameter is.

`streetlight/{streetlight_id}/event/turnon` which are for requesting another application when the light is acutally turned on.



One very important thing to keep in mind here when looking at the streetlight [AsyncAPI document](./streetlight.json) you might notice that the publish and subscribe operations look weird and reversed. If not, great skip the following explaination. The request/reply pattern uses the existing publish and subscribe operations to define what is replied and what is requested. This is determined by the NATS bindings provided by the AsyncAPI spec. As observed for the channel `streetlight/{streetlight_id}/command/turnon` its bindings are defined as being a `replier`. This means that the publish operation are used to describe what is being published to the application and the subscribe operation describes the corresponding reply.

For the request channel `streetlight/{streetlight_id}/event/turnon` it has the binding `requester` which means that the publish operation are used to describe what is being published to it and the subscribe operation are used to describe what the request the application are to send. 