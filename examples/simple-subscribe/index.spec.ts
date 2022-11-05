jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error');
const logSpy = jest.spyOn(global.console, 'log');
import { TestClient, TurnOn } from './asyncapi-nats-client';
import { waitForMessage, unSubscribe } from './index';
describe('Should be able to setup reply', () => {
  let testClient: TestClient.NatsAsyncApiTestClient;
  beforeAll(async () => {
    //await unSubscribe();
    testClient = new TestClient.NatsAsyncApiTestClient();
    await testClient.connectToLocal();
  })
  afterAll(async () => {
    await testClient.disconnect();
    await unSubscribe();
    jest.restoreAllMocks();
  });
  test('and receive correct data', async () => {
    const message = new TurnOn({lumen: 10});
    await testClient.publishToStreetlightStreetlightIdCommandTurnon(message, '101');
    await waitForMessage();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Got message {\"lumen\": 10} on parameter streetlight 101');
  });
});