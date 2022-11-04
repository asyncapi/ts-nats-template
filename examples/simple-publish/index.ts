import { NatsAsyncApiClient, TurnOn } from 'asyncapi-nats-client';

/**
 * Send a message
 */
export async function sendMessage() {
  const client = new NatsAsyncApiClient();
  await client.connectToLocal();
  const message = new TurnOn({lumen: 10});
  await client.publishToStreetlightStreetlightIdCommandTurnon(message, '101');
  await client.disconnect();
}
sendMessage();