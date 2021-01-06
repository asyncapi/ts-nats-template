
import {describe, it} from 'mocha';
import {expect} from 'chai';
import * as Client from '../index'
import * as TestClient from './testclient/index'
import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';

describe('streetlight/{streetlight_id}/event/turnon can talk to it self', () => {
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
    var recievedStreetlightId : string | undefined = undefined
    
    var replyMessage: TestClient.GeneralReplyMessage.GeneralReply = {
  "status_code": 0,
  "status_message": "string"
};
    var requestMessage: Client.AnonymousMessage4Message.AnonymousMessage4  = {
  "lumen": 0
};
    var StreetlightIdToSend: string = "string"
    const replySubscription = await testClient.replyToStreetlightStreetlightIdEventTurnon((err, msg 
        
          ,streetlight_id
          ) => {
        return new Promise((resolve, reject) => {
            receivedError = err;
            receivedMsg = msg;
            recievedStreetlightId = streetlight_id
            resolve(replyMessage);
        })},
        (err) => {console.log(err)}
        , StreetlightIdToSend,
        true
    );
    const tryAndWaitForResponse = new Promise((resolve, reject) => {
        let isReturned = false;
        setTimeout(() => {
            if(!isReturned){
                reject(new Error("Timeout"));
            }
        }, 3000)
        setInterval(async () => {
            if(replySubscription.getReceived() === 1){
                resolve();
                isReturned = true
            }
        }, 100);
    });
    var reply = await client.requestStreetlightStreetlightIdEventTurnon(requestMessage 
      , StreetlightIdToSend);
    await tryAndWaitForResponse;
    expect(reply).to.be.deep.equal(replyMessage)
    expect(receivedError).to.be.undefined;
    expect(receivedMsg).to.be.deep.equal(requestMessage);
    expect(recievedStreetlightId).to.be.equal(StreetlightIdToSend);
    
    });

    after( async () => {
        await client.disconnect();
        await testClient.disconnect();
    });
});
  