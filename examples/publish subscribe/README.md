<h1 align="center">Streetlight example</h1>
<p align="center">
  <em>Publish and subscribe</em>
</p>

This example contains two channels are:

`streetlight/{streetlight_id}/command/turnon` which are for subscribing to the command `turnon`. The generated client interprets this as the NATS topic `streetlight.{streetlight_id}.command.turnon`. The `{streetlight_id}` is the channel parameter which are not realized before actually subscribing to anything. When a message is received on channel `streetlight.1.command.turnon` it can automatically interpret what the `streetlight_id` parameter is.

`streetlight/{streetlight_id}/event/turnon` which are for publishing when the light is acutally turned on.
