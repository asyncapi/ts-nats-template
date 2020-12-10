

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
    
    it('Clients can connect', () => {
        expect(client.isClosed()).to.be.false;
        expect(testClient.isClosed()).to.be.false;
    });

    it('can send message', async () => {
      
  
var receivedError: NatsTypescriptTemplateError | undefined = undefined; 
var receivedMsg: TestClient.AnonymousMessage2Message.AnonymousMessage2 | undefined = undefined;
var recievedStreetlightId : string | undefined = undefined


var publishMessage: TestClient.AnonymousMessage2Message.AnonymousMessage2  = {
  "lumen": 0
};
var StreetlightIdToSend: string = "string"


const tryAndWaitForResponse = new Promise(resolve => {
    setTimeout(resolve, 100);
});


const replySubscription = await testClient.subscribeToStreetlightStreetlightIdEventTurnon((err, msg 
        
          ,streetlight_id
        ) => {
        receivedError = err;
        receivedMsg = msg;
        recievedStreetlightId = streetlight_id
        
    }
    , StreetlightIdToSend
    
);
await client.publishToStreetlightStreetlightIdEventTurnon(publishMessage
    , StreetlightIdToSend
    );
await tryAndWaitForResponse;
expect(receivedError).to.be.undefined;
expect(receivedMsg).to.be.deep.equal(publishMessage);
expect(recievedStreetlightId).to.be.equal(StreetlightIdToSend);


    });

    it('Can shutdown', async () => {
        await client.disconnect()
        await testClient.disconnect()
        expect(client.isClosed()).to.be.true;
        expect(testClient.isClosed()).to.be.true;
    });

});