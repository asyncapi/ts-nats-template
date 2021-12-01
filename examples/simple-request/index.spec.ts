jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { return; });
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
    jest.restoreAllMocks();
  });
  test('and receive correct data', async () => {
    await testClient.replyToStreetlightStreetlightIdEventTurnon(
      async (err) => {
        if(err) {
          console.error(err);
        }
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
    expect(errorSpy).not.toHaveBeenCalled();
  });
});