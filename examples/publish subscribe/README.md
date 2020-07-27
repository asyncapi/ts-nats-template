<h1 align="center">Streetlight example</h1>
<p align="center">
  <em>Publish and subscribe</em>
</p>


# How to run it

1. Run the docker-compose file `../docker-compose.yml` or run the NATS server your self locally on the standard port.
2. Install the dependencies `npm i`
3. Run the local test with `npm run start` 



# Description

This example contains two channels are:

`streetlight/{streetlight_id}/command/turnon` which are for subscribing to the command `turnon`. The generated client interprets this as the NATS topic `streetlight.{streetlight_id}.command.turnon`. The `{streetlight_id}` is the channel parameter which are not realized before actually subscribing to anything. When a message is received on channel `streetlight.1.command.turnon` it can automatically interpret what the `streetlight_id` parameter is.

`streetlight/{streetlight_id}/event/turnon` are for publishing when the light is acutally turned on.
