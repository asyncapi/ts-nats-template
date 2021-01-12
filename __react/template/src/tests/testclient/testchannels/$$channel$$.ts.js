import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../../../components/channel/publish';
import { Subscribe } from '../../../../../components/channel/subscribe';
import { Reply } from '../../../../../components/channel/reply';
import { Request } from '../../../../../components/channel/request';
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub, messageHasNotNullPayload} from '../../../../../utils/index';

/**
 * Return the correct channel component based on whether its `pubSub` or `requestReply`.
 * 
 * NOTICE this is a reverse of the normal client channel.
 * 
 * @param {*} asyncapi 
 * @param {*} channel 
 * @param {*} channelName 
 * @param {*} params 
 */
function getChannelCode(asyncapi, channel, channelName, params) {
  let channelcode;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      channelcode = Reply(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish().message(0),
        channel.subscribe().message(0),
        channel.parameters(),
        params
      );
    }
    if (isReplier(channel)) {
      channelcode = Request(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish().message(0),
        channel.subscribe().message(0),
        channel.parameters()
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      channelcode = Subscribe(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.subscribe().message(0),
        channel.parameters());
    }
    if (channel.hasPublish()) {
      channelcode = Publish(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish().message(0), 
        channel.parameters());
    }
  }
  return channelcode;
}
export default function channelRender({ asyncapi, channelName, channel, params }) {
  // Import the correct messages
  let publishMessageImport = '';
  if(channel.hasPublish() && messageHasNotNullPayload(channel.publish().message(0).payload())){
    publishMessageImport = `import * as ${pascalCase(channel.publish().message(0).uid())}Message from '../../../messages/${pascalCase(channel.publish().message(0).uid())}'`
  }

  let subscribeMessageImport = '';
  if(channel.hasSubscribe() && messageHasNotNullPayload(channel.subscribe().message(0).payload())){
    subscribeMessageImport = `import * as ${pascalCase(channel.subscribe().message(0).uid())}Message from '../../../messages/${pascalCase(channel.subscribe().message(0).uid())}'`
  }

  return <File name={`${pascalCase(channelName)}.ts`}>
    {`
      ${publishMessageImport}
      ${subscribeMessageImport}

      import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
      import {ErrorCode, NatsTypescriptTemplateError} from '../../../NatsTypescriptTemplateError';
      import { Hooks } from '../../../hooks';

      ${getChannelCode(asyncapi, channel, channelName, params)}
    `}
  </File>;
}