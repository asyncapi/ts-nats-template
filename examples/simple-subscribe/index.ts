import { NatsAsyncApiClient } from 'asyncapi-nats-client';
const client = new NatsAsyncApiClient();
let gotMessage = false;
/**
 * Used by the test code.
 */
export async function unSubscribe() {
  await client.disconnect();
}

export function waitForMessage() {
  const poll = resolve => {
    if(gotMessage === true) resolve();
    else setTimeout(_ => poll(resolve), 100);
  }
  return new Promise(poll);
}

/**
 * Subscribe to channel
 */
export async function setupSubscribe() {
  await client.connectToLocal();

  client.subscribeToStreetlightStreetlightIdCommandTurnon(async (err, msg, streetlight_id) => {
    console.log(`Got message ${msg?.marshal()} on parameter streetlight ${streetlight_id}`);
    gotMessage = true;
  }, '*');
}
setupSubscribe();