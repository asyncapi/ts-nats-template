import { File } from '@asyncapi/generator-react-sdk';
import { Events } from '../../../../components/events';
import { getStandardClassCode, getStandardHeaderCode } from '../../../../components/index/standard';
import { Publish } from '../../../../components/index/publish';
import { Subscribe } from '../../../../components/index/subscribe';
import { Reply } from '../../../../components/index/reply';
import { Request } from '../../../../components/index/request';
import { isRequestReply, isReplier, isRequester, isPubsub} from '../../../../utils/index';

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * 
 * @param {*} asyncapi 
 * @param {*} params 
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getChannelWrappers(asyncapi, params) {
  let channelWrappers = asyncapi.channels();
  channelWrappers = Object.keys(channelWrappers).length ? Object.entries(channelWrappers).map(([channelName, channel]) => {
    const publishMessage = channel.publish() ? channel.publish().message(0) : undefined;
    const subscribeMessage = channel.subscribe() ? channel.subscribe().message(0) : undefined;
    const defaultContentType = asyncapi.defaultContentType();
    const channelDescription = channel.description();
    const channelParameters = channel.parameters();
    if (isRequestReply(channel)) {
      if (isRequester(channel)) {
        return Reply(defaultContentType, 
          channelName, 
          publishMessage,
          subscribeMessage,
          channelDescription,
          channelParameters,
          params
        );
      }
      if (isReplier(channel)) {
        return Request(
          defaultContentType, 
          channelName, 
          publishMessage,
          subscribeMessage,
          channelDescription,
          channelParameters
        );
      }
    }

    if (isPubsub(channel)) {
      if (channel.hasSubscribe()) {
        return Subscribe(
          defaultContentType, 
          channelName, 
          subscribeMessage, 
          channelDescription, 
          channelParameters);
      }
      if (channel.hasPublish()) {
        return Publish(
          defaultContentType, 
          channelName, 
          publishMessage, 
          channelDescription, 
          channelParameters);
      }
    }
  }) : '';
  return channelWrappers;
}

export default function indexFile({ asyncapi, params }) {
  return (
    <File name="index.ts">
      {`
${getStandardHeaderCode(asyncapi, '../..', './testchannels')}

export declare interface NatsAsyncApiTestClient {
  ${Events()}
}

export class NatsAsyncApiTestClient extends events.EventEmitter{
  ${getStandardClassCode(asyncapi)}
  ${getChannelWrappers(asyncapi, params).join('')}
}
      `}
    </File>
  );
}
