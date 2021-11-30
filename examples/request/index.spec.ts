import { GeneralReply, TestClient } from './asyncapi-nats-client';
import {sendRequest} from './index';
describe('Should be able to receive request from example', () => {
  let testClient;
  beforeAll(async () => {
    testClient = new TestClient.NatsAsyncApiTestClient();
    await testClient.connectToLocal();
  })
  afterAll(async () => {
    await testClient.disconnect();
  });
  test('and receive correct data', async () => {
    await testClient.replyToStreetlightStreetlightIdEventTurnon(
      async (err, msg, streetlight_id) => {
        if(err) {
          console.error(err);
        }
        console.log(`Received request ${msg.marshal()} for streetlight ${streetlight_id}`);
        const replyMessage = new GeneralReply({});
        replyMessage.statusCode = 200;
        replyMessage.statusMessage = 'All OK';
        return replyMessage;
      }, 
      (error) => {
        console.error(error);
      }, 
      '*'
    );
    await sendRequest();
  });
});