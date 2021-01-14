import { File } from '@asyncapi/generator-react-sdk';
import { publishSubscribe } from '../../../components/test/publishSubscribe';
import { requestReply } from '../../../components/test/requestReply';
import { isRequestReply, isReplier, isRequester, isPubsub, pascalCase} from '../../../utils/index';

/**
 * Return the correct test code based on whether the channel is `pubSub` or `requestReply`
 * @param {*} channel 
 * @param {*} channelName 
 * @param {*} params passed template parameters
 */
function getTestCode(channel, channelName, params) {
  const publishMessage = channel.publish().message(0);
  const subscribeMessage = channel.subscribe().message(0);
  const channelParameters = channel.parameters();
  let testMethod;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      testMethod = requestReply(
        channelName, 
        publishMessage,
        subscribeMessage,
        channelParameters
      );
    }
    if (isReplier(channel)) {
      testMethod = requestReply(
        channelName, 
        subscribeMessage,
        publishMessage,
        channelParameters
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      testMethod = publishSubscribe(
        channelName, 
        subscribeMessage, 
        channelParameters,
        params);
    }
    if (channel.hasPublish()) {
      testMethod = publishSubscribe(
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