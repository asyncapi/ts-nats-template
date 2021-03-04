import { File } from '@asyncapi/generator-react-sdk';
import { publish, subscribe } from '../../../components/test/publishSubscribe';
import { request, reply } from '../../../components/test/requestReply';
import { isRequestReply, isReplier, isRequester, isPubsub, pascalCase} from '../../../utils/index';

/**
 * Return the correct test code based on whether the channel is `pubSub` or `requestReply`
 * @param {*} channel 
 * @param {*} channelName 
 * @param {*} params passed template parameters
 */
function getTestCode(channel, channelName, params) {
  const publishMessage = channel.publish() ? channel.publish().message(0) : undefined;
  const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;
  const channelParameters = channel.parameters();
  let testMethod;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      testMethod = request(
        channelName, 
        publishMessage,
        subscribeMessage,
        channelParameters
      );
    }
    if (isReplier(channel)) {
      testMethod = reply(
        channelName, 
        subscribeMessage,
        publishMessage,
        channelParameters
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      testMethod = publish(
        channelName, 
        subscribeMessage, 
        channelParameters);
    }
    if (channel.hasPublish()) {
      testMethod = subscribe(
        channelName, 
        publishMessage, 
        channelParameters);
    }
  }
  return testMethod;
}

export default function channelRender({ channelName, channel, params }) {
  return <File name={`${pascalCase(channelName)}.spec.ts`}>
    {`
import {describe, it, before} from 'mocha';
import {expect} from 'chai';
import * as Client from '../../src'
import * as TestClient from '../../src/testclient'
import { NatsTypescriptTemplateError } from '../../src/NatsTypescriptTemplateError';

describe('${channelName} can talk to itself', () => {
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
      ${getTestCode(channel, channelName, params)}
    });

    after( async () => {
        await client.disconnect();
        await testClient.disconnect();
    });
});
  `}
  </File>;
}
