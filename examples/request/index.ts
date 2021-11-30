import { NatsAsyncApiClient, AnonymousSchema_3 } from 'asyncapi-nats-client';

/**
 * Send a request to turn on the specific streetlight.
 */
export async function sendRequest() {
  const client = new NatsAsyncApiClient();
  try{
    await client.connectToLocal();
    const requestMessage = new AnonymousSchema_3({
      lumen: 20
    });
    const streetlight_id = 'test_streetlight_1';
    const response = await client.requestStreetlightStreetlightIdEventTurnon(requestMessage, streetlight_id);
    console.log(`Received response ${response.marshal()} for streetlight ${streetlight_id}`);
  }catch(e) {
  }
  await client.disconnect();  
}

sendRequest();