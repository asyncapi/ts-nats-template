import { File } from "@asyncapi/generator-react-sdk";
import { Publish } from "../../../components/test/publish";
import { Subscribe } from "../../../components/test/subscribe";
import { Reply } from "../../../components/test/reply";
import { Request } from "../../../components/test/request";
import { isRequestReply, isReplier, isRequester, isPubsub} from "../../../utils/general";


export default function({ asyncapi, channelName, channel, params }) {
  let testMethod;
  if(isRequestReply(channel)){
    if(isRequester(channel)){
      testMethod = Request(
            channelName, 
            channel.subscribe().message(0),
            channel.publish().message(0),
            channel.parameters()
          );
    }
    if(isReplier(channel)){
      testMethod = Reply(
          channelName, 
          channel.subscribe().message(0),
          channel.publish().message(0),
          channel.parameters(),
          params
        );
    }
  }

  if(isPubsub(channel)){
    if(channel.hasSubscribe()){
      testMethod = Publish(
          channelName, 
          channel.subscribe().message(0), 
          channel.parameters())
    }
    if(channel.hasPublish()){
      testMethod = Subscribe(
          channelName, 
          channel.publish().message(0), 
          channel.parameters())
    }
  }

  return <File>
  {
    `
import {describe, it} from 'mocha';
import {expect} from 'chai';
import * as Client from '../index'
import * as TestClient from './testclient/index'
import { NatsTypescriptTemplateError } from '../NatsTypescriptTemplateError';

describe('${channelName} can talk to it self', () => {
    var client: Client.NatsAsyncApiClient;
    var testClient: TestClient.NatsAsyncApiTestClient;
    before(async () => {
        client = new Client.NatsAsyncApiClient();
        testClient = new TestClient.NatsAsyncApiTestClient();
        const natsHost = process.env.NATS_HOST || "0.0.0.0"
        const natsPort = process.env.NATS_PORT || "4222"
        const natsUrl = \`\${natsHost}:\${natsPort}\`
        await client.connectToHost(natsUrl);
        await testClient.connectToHost(natsUrl);
    });

    it('can send message', async () => {
      ${testMethod}
    });

    after( async () => {
        await client.disconnect();
        await testClient.disconnect();
    });
});
  `}
  </File>
}