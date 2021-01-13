import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../components/channel/publish';
import { Subscribe } from '../../../components/channel/subscribe';
import { Reply } from '../../../components/channel/reply';
import { Request } from '../../../components/channel/request';
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub, messageHasNotNullPayload} from '../../../utils/index';

/**
 * Return the correct channel component based on whether its `pubSub` or `requestReply`.
 * 
 * @param {*} asyncapi 
 * @param {*} channel to determine the type of
 * @param {*} channelName 
 * @param {*} params
 */
function getChannelCode(asyncapi, channel, channelName, params) {
  const publishMessage = channel.publish().message(0);
  const subscribeMessage = channel.subscribe().message(0);
  let channelcode;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      channelcode = Request(
        asyncapi.defaultContentType(), 
        channelName, 
        subscribeMessage,
        publishMessage,
        channel.parameters()
      );
    }
    if (isReplier(channel)) {
      channelcode = Reply(
        asyncapi.defaultContentType(), 
        channelName, 
        subscribeMessage,
        publishMessage,
        channel.parameters(),
        params
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      channelcode = Publish(
        asyncapi.defaultContentType(), 
        channelName, 
        subscribeMessage, 
        channel.parameters());
    }
    if (channel.hasPublish()) {
      channelcode = Subscribe(
        asyncapi.defaultContentType(), 
        channelName, 
        publishMessage, 
        channel.parameters());
    }
  }
  return channelcode;
}

export default function channelRender({ asyncapi, channelName, channel, params }) {
  // Import the correct messages
  const publishMessage = channel.publish().message(0);
  let publishMessageImport = '';
  if(channel.hasPublish() && messageHasNotNullPayload(publishMessage.payload())){
    const publishMessageUid = publishMessage.uid();
    publishMessageImport = `import * as ${pascalCase(publishMessageUid)}Message from '../messages/${pascalCase(publishMessageUid)}'`
  }

  const subscribeMessage = channel.subscribe().message(0);
  let subscribeMessageImport = '';
  if(channel.hasSubscribe() && messageHasNotNullPayload(subscribeMessage.payload())){
    const subscribeMessageUid = subscribeMessage.uid();
    subscribeMessageImport = `import * as ${pascalCase(subscribeMessageUid)}Message from '../messages/${pascalCase(subscribeMessageUid)}'`
  }

  return <File name={`${pascalCase(channelName)}.ts`}>
    {`
    ${publishMessageImport}
    ${subscribeMessageImport}

    import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
    import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
    import { Hooks } from '../hooks';

    ${getChannelCode(asyncapi, channel, channelName, params)}
    `}
  </File>;
}