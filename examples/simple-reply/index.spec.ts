jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error');
import { TurnOnRequest, TestClient } from './asyncapi-nats-client';
import { setupReply } from './index';
describe('Should be able to setup reply', () => {
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
    await setupReply();
    const requestMessage = new TurnOnRequest({
      lumen: 20
    });
    const streetlight_id = 'test_streetlight_1';
    try {
      const reply1 = await testClient.requestStreetlightStreetlightIdCommandTurnon(requestMessage, streetlight_id);
      expect(reply1).not.toBeUndefined();
    } catch (error) {
      console.error(error);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });
});