import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../../components/channel/publish';
import { Subscribe } from '../../../../components/channel/subscribe';
import { Reply } from '../../../../components/channel/reply';
import { Request } from '../../../../components/channel/request';
import { General } from '../../../../components/channel/general';
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub} from '../../../../utils/index';

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
// eslint-disable-next-line sonarjs/cognitive-complexity
function getChannelCode(asyncapi, channel, channelName, params) {
  let channelcode;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      channelcode = Reply(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined,
        channel.subscribe() ? channel.subscribe().message(0) : undefined,
        channel.parameters(),
        params
      );
    }
    if (isReplier(channel)) {
      channelcode = Request(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined,
        channel.subscribe() ? channel.subscribe().message(0) : undefined,
        channel.parameters()
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      channelcode = Subscribe(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.subscribe() ? channel.subscribe().message(0) : undefined,
        channel.parameters());
    }
    if (channel.hasPublish()) {
      channelcode = Publish(
        asyncapi.defaultContentType(), 
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined, 
        channel.parameters());
    }
  }
  return channelcode;
}
export default function channelRender({ asyncapi, channelName, channel, params }) {
  const publishMessage = channel.publish() ? channel.publish().message(0) : undefined;
  const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;

  return <File name={`${pascalCase(channelName)}.ts`}>
{`
${General(channel, publishMessage, subscribeMessage, '../..')}

${getChannelCode(asyncapi, channel, channelName, params)}
`}
  </File>;
}
