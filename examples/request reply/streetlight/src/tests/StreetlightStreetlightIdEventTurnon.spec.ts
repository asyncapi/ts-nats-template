
import {describe, it, before} from 'mocha';
import {expect} from 'chai';
import * as Client from '../index'
import * as TestClient from './testclient/index'
import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';

describe('streetlight/{streetlight_id}/event/turnon can talk to itself', () => {
    var client: Client.NatsAsyncApiClient;
    var testClient: TestClient.NatsAsyncApiTestClient;
    before(async () => {
        client = new Client.NatsAsyncApiClient();
        testClient = new TestClient.NatsAsyncApiTestClient();
        const natsHost = process.env.NATS_HOST || "0.0.0.0"
        const natsPort = process.env.NATS_PORT || "4222"
        const natsUrl = `${natsHost}:${natsPort}`
        await client.connectToHost(natsUrl);
        await testClient.connectToHost(natsUrl);
    });

    it('can send message', async () => {
      
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: Client.AnonymousMessage4Message.AnonymousMessage4 | undefined = undefined;

var receivedStreetlightId : string | undefined = undefined

var replyMessage: TestClient.GeneralReplyMessage.GeneralReply = {
  "status_code": 0,
  "status_message": "string"
};
var receiveMessage: Client.AnonymousMessage4Message.AnonymousMessage4 = {
  "lumen": 0
};
var StreetlightIdToSend: string = "string"
const replySubscription = await testClient.replyToStreetlightStreetlightIdEventTurnon((err, msg 
      ,streetlight_id) => {
    return new Promise((resolve, reject) => {
        receivedError = err;
        receivedMsg = msg;
        receivedStreetlightId = streetlight_id
        resolve(replyMessage);
    })},
    (err) => {console.log(err)}
    , StreetlightIdToSend,
    true
);
var reply = await client.requestStreetlightStreetlightIdEventTurnon(receiveMessage , StreetlightIdToSend);
expect(reply).to.be.deep.equal(replyMessage)
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(receiveMessage);
expect(receivedStreetlightId).to.be.equal(StreetlightIdToSend);
    
    });

    after( async () => {
        await client.disconnect();
        await testClient.disconnect();
    });
});
  