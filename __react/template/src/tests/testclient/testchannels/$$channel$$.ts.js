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
  const publishMessage = channel.publish().message(0);
  const subscribeMessage = channel.subscribe().message(0);

  return <File name={`${pascalCase(channelName)}.ts`}>
{`
${General(channel, publishMessage, subscribeMessage, '../../..')}

${getChannelCode(asyncapi, channel, channelName, params)}
`}
  </File>;
}