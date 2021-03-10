import { File } from '@asyncapi/generator-react-sdk';
import { Publish } from '../../../components/channel/publish';
import { Subscribe } from '../../../components/channel/subscribe';
import { Reply } from '../../../components/channel/reply';
import { Request } from '../../../components/channel/request';
import { General } from '../../../components/channel/general';
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub, camelCase} from '../../../utils/index';
// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocument, Channel } from '@asyncapi/parser';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 * @property {boolean} promisifyReplyCallback - whether or not reply callbacks should be promisify.
 */
/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi received from the generator.
 * @property {Channel} channel 
 * @property {string} channelName 
 * @property {TemplateParameters} params received from the generator.
 */

/**
 * Return the correct channel component based on whether its `pubSub` or `requestReply`.
 * 
 * @param {AsyncAPIDocument} asyncapi 
 * @param {Channel} channel to determine the type of
 * @param {string} channelName 
 * @param {TemplateParameters} params
 */
function getChannelCode(asyncapi, channel, channelName, params) {
  const publishOperation = channel.publish() ? channel.publish() : undefined;
  const publishMessage = publishOperation ? publishOperation.message(0) : undefined;
  const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;
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
        params,
        publishOperation
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
        channel.parameters(),
        publishOperation);
    }
  }
  return channelcode;
}

/**
 * Function to render file.
 * 
 * @param {RenderArgument} param0 render arguments received from the generator.
 */
export default function channelRender({ asyncapi, channelName, channel, params }) {
  const publishMessage = channel.publish() ? channel.publish().message(0) : undefined;
  const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;

  return <File name={`${pascalCase(channelName)}.ts`}>
    {`
${General(channel, publishMessage, subscribeMessage, '..')}

/**
 * Module which wraps functionality for the \`${channelName}\` channel
 * @module ${camelCase(channelName)}
 */

${getChannelCode(asyncapi, channel, channelName, params)}
    `}
  </File>;
}
