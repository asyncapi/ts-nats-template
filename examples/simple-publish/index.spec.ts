jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error');
import { TestClient } from './asyncapi-nats-client';
import { sendMessage } from './index';
describe('Should be able to publish data', () => {
  let testClient: TestClient.NatsAsyncApiTestClient;
  beforeAll(async () => {
    testClient = new TestClient.NatsAsyncApiTestClient();
    await testClient.connectToLocal();
  })
  afterAll(async () => {
    await testClient.disconnect();
    jest.restoreAllMocks();
  });
  test('and receive correct data', (done) => {
    (async () => {
      try {
        testClient.subscribeToStreetlightStreetlightIdCommandTurnon((err, msg, streetlight_id) => {
          expect(err).toBeUndefined();
          expect(streetlight_id).not.toBeUndefined();
          expect(msg).not.toBeUndefined();
          expect(errorSpy).not.toHaveBeenCalled();
          done();
        }, '*');
        await sendMessage();
      } catch (error) {
        done(error);
      }
    })();
  });
});