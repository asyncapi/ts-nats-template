

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
var receivedMsg: TestClient.AnonymousMessage2Message.AnonymousMessage2 | undefined = undefined;
var recievedStreetlightId : string | undefined = undefined


var publishMessage: TestClient.AnonymousMessage2Message.AnonymousMessage2  = {
  "lumen": 0
};
var StreetlightIdToSend: string = "string"

const replySubscription = await testClient.subscribeToStreetlightStreetlightIdEventTurnon((err, msg 
        
          ,streetlight_id
        ) => {
        receivedError = err;
        receivedMsg = msg;
        recievedStreetlightId = streetlight_id
        
    }
    , StreetlightIdToSend
    
);
const tryAndWaitForResponse = new Promise((resolve, reject) => {
    let isReturned = false;
    setTimeout(() => {
        if(!isReturned){
            reject("timeout");
        }
    }, 3000)
    setInterval(async () => {
        if(replySubscription.getReceived() === 1){
            resolve();
            isReturned = true
        }
    }, 100);
});
await client.publishToStreetlightStreetlightIdEventTurnon(publishMessage
    , StreetlightIdToSend
    );
await tryAndWaitForResponse;
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(publishMessage);
expect(recievedStreetlightId).to.be.equal(StreetlightIdToSend);


    });

    after( async () => {
        await client.disconnect();
        await testClient.disconnect();
    });

});