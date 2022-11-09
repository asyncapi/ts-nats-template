import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../../components/channel/publish';
import { Subscribe } from '../../../../components/channel/subscribe';
import { Reply } from '../../../../components/channel/reply';
import { Request } from '../../../../components/channel/request';
import { General } from '../../../../components/channel/general';
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub, camelCase} from '../../../../utils/index';
// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocument, Channel } from '@asyncapi/parser';
import { JetstreamPushSubscription } from '../../../../components/channel/jetstreamPushSubscription';
import { JetstreamPull } from '../../../../components/channel/jetstreamPull';
import { JetstreamFetch } from '../../../../components/channel/jetStreamFetch';
import { JetstreamPublish } from '../../../../components/channel/jetstreamPublish';
import { JetstreamPullSubscription } from '../../../../components/channel/jetStreamPullSubscription';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 * @property {boolean} promisifyReplyCallback - whether or not reply callbacks should be promisify.
 */
/**
 * @typedef RenderArgument
 * @type {object}
 * @property {Channel} channel 
 * @property {string} channelName 
 * @property {TemplateParameters} params received from the generator.
 */

/**
 * Return the correct channel component based on whether its `pubSub` or `requestReply`.
 * 
 * NOTICE this is a reverse of the normal client channel.
 * 
 * @param {AsyncAPIDocument} asyncapi 
 * @param {Channel} channel 
 * @param {string} channelName 
 * @param {TemplateParameters} params 
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getChannelCode(channel, channelName, params) {
  let channelcode;
  if (isRequestReply(channel)) {
    if (isRequester(channel)) {
      channelcode = Reply(
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined,
        channel.subscribe() ? channel.subscribe().message(0) : undefined,
        channel.parameters(),
        params
      );
    }
    if (isReplier(channel)) {
      channelcode = Request(
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined,
        channel.subscribe() ? channel.subscribe().message(0) : undefined,
        channel.parameters()
      );
    }
  }

  if (isPubsub(channel)) {
    if (channel.hasSubscribe()) {
      const message = channel.subscribe() ? channel.subscribe().message(0) : undefined;
      const normalSubscribeCode = Subscribe(
        channelName, 
        message,
        channel.parameters());
      const jetstreamPushSubscriptionCode = JetstreamPushSubscription(
        channelName, 
        message,
        channel.parameters());
      const jetstreamPullSubscriptionCode = JetstreamPullSubscription(
        channelName, 
        message, 
        channel.parameters());
      const jetstreamPullCode = JetstreamPull(
        channelName, 
        message,
        channel.parameters());
      const jetstreamFetchCode = JetstreamFetch(
        channelName, 
        message,
        channel.parameters());
      channelcode = `${normalSubscribeCode}\n${jetstreamPullCode}\n${jetstreamPushSubscriptionCode}\n${jetstreamPullSubscriptionCode}\n${jetstreamFetchCode}`;
    }
    if (channel.hasPublish()) {
      const publishCode = Publish(
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined, 
        channel.parameters());
      const jetstreamPublishCode = JetstreamPublish(
        channelName, 
        channel.publish() ? channel.publish().message(0) : undefined, 
        channel.parameters());
      channelcode = `${publishCode} \n${jetstreamPublishCode}`;
    }
  }
  return channelcode;
}

/**
 * Function to render file.
 * 
 * @param {RenderArgument} param0 render arguments received from the generator.
 */
export default function channelRender({ channelName, channel, params }) {
  if (!params.generateTestClient) {
    return;
  }

  const publishMessage = channel.publish() ? channel.publish().message(0) : undefined;
  const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;

  return <File name={`${pascalCase(channelName)}.ts`}>
    {`
${General(channel, publishMessage, subscribeMessage, '../..')}

/**
 * Module which wraps functionality for the \`${channelName}\` channel
 * @module ${camelCase(channelName)}
 */
${getChannelCode(channel, channelName, params)}
`}
  </File>;
}
