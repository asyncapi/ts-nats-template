import { File } from "@asyncapi/generator-react-sdk";
import { Publish } from "../../../../../components/channel/publish";
import { Subscribe } from "../../../../../components/channel/subscribe";
import { Reply } from "../../../../../components/channel/reply";
import { Request } from "../../../../../components/channel/request";
import { pascalCase, isRequestReply, isReplier, isRequester, isPubsub, messageHasNotNullPayload} from "../../../../../utils/general";

export default function({ asyncapi, channelName, channel, params }) {
  let channelcode;
  if(isRequestReply(channel)){
    if(isRequester(channel)){
        channelcode = Reply(
            asyncapi.defaultContentType(), 
            channelName, 
            channel.publish().message(0),
            channel.subscribe().message(0),
            channel.description(),
            channel.parameters(),
            params
          );
    }
    if(isReplier(channel)){
      channelcode = Request(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.publish().message(0),
          channel.subscribe().message(0),
          channel.description(),
          channel.parameters()
        );
    }
  }

  if(isPubsub(channel)){
    if(channel.hasSubscribe()){
        channelcode = Subscribe(
            asyncapi.defaultContentType(), 
            channelName, 
            channel.subscribe().message(0), 
            channel.description(), 
            channel.parameters())
    }
    if(channel.hasPublish()){
        channelcode = Publish(
            asyncapi.defaultContentType(), 
            channelName, 
            channel.publish().message(0), 
            channel.description(), 
            channel.parameters())
    }
  }

  return <File name={pascalCase(channelName)}>
  {
    `
    ${
      channel.hasPublish() && messageHasNotNullPayload(channel.publish().message(0).payload()) &&
      `
      import * as ${pascalCase(channel.publish().message(0).uid())}Message from '../../../messages/${pascalCase(channel.publish().message(0).uid())}}'
      `
    }
    ${
      channel.hasSubscribe() && messageHasNotNullPayload(channel.subscribe().message(0).payload()) &&
      `
      import * as ${pascalCase(channel.subscribe().message(0).uid())}Message from '../../../messages/${pascalCase(channel.subscribe().message(0).uid())}}'
      `
    }
    import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
    import {ErrorCode, NatsTypescriptTemplateError} from '../../../NatsTypescriptTemplateError';
    import { Hooks } from '../../../hooks';

    ${channelcode}
  `}
  </File>
}