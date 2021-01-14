import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../components/channel/publish';
import { Subscribe } from '../../../components/channel/subscribe';
import { Reply } from '../../../components/channel/reply';
import { Request } from '../../../components/channel/request';
import { General } from '../../../components/channel/general';
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
  const publishMessage = channel.publish().message(0);
  const subscribeMessage = channel.subscribe().message(0);

  return <File name={`${pascalCase(channelName)}.ts`}>
    {`
${General(channel, publishMessage, subscribeMessage, '..')}

${getChannelCode(asyncapi, channel, channelName, params)}
    `}
  </File>;
}