import { File } from '@asyncapi/generator-react-sdk';
import { Events } from '../../../../components/events';
import { Standard } from '../../../../components/index/standard';
import { Publish } from '../../../../components/index/publish';
import { Subscribe } from '../../../../components/index/subscribe';
import { Reply } from '../../../../components/index/reply';
import { Request } from '../../../../components/index/request';
import { camelCase, pascalCase, firstUpperCase, isRequestReply, isReplier, isRequester, isPubsub} from '../../../../utils/general';

// eslint-disable-next-line sonarjs/cognitive-complexity
function getChannelWrappers(asyncapi, params) {
  let channelWrappers = asyncapi.channels();
  channelWrappers = Object.keys(channelWrappers).length ? Object.entries(channelWrappers).map(([channelName, channel]) => {
    if (isRequestReply(channel)) {
      if (isRequester(channel)) {
        return Reply(asyncapi.defaultContentType(), 
          channelName, 
          channel.publish().message(0),
          channel.subscribe().message(0),
          channel.description(),
          channel.parameters(),
          params
        );
      }
      if (isReplier(channel)) {
        return Request(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.publish().message(0),
          channel.subscribe().message(0),
          channel.description(),
          channel.parameters()
        );
      }
    }

    if (isPubsub(channel)) {
      if (channel.hasSubscribe()) {
        return Subscribe(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.subscribe().message(0), 
          channel.description(), 
          channel.parameters());
      }
      if (channel.hasPublish()) {
        return Publish(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.publish().message(0), 
          channel.description(), 
          channel.parameters());
      }
    }
  }) : '';
  return channelWrappers;
}

export default function indexFile({ asyncapi, params }) {
  let channelImport = asyncapi.channels();
  channelImport = Object.keys(channelImport).length ? Object.entries(channelImport).map(([channelName, _]) => {
    return `
      import * as ${camelCase(channelName)}Channel from "./testchannels/${firstUpperCase(pascalCase(channelName))}";
      export {${camelCase(channelName)}Channel};
    `;
  }) : '';

  const messagesImport = [];
  for (const [messageName] of asyncapi.allMessages()) {
    const pascalMessageName = pascalCase(messageName);
    messagesImport.push(`
      import * as ${pascalMessageName}Message from "../../messages/${pascalMessageName}";
      export {${pascalMessageName}Message};
    `);
  }

  return (
    <File name="index.ts">
      {
        `
        import {fromSeed} from 'ts-nkeys';
        import {ErrorCode, NatsTypescriptTemplateError} from './NatsTypescriptTemplateError';
        import { 
          Client, 
          NatsConnectionOptions, 
          connect,
          Payload, 
          NatsError, 
          Subscription, 
          ServersChangedEvent, 
          SubEvent, 
          ServerInfo,
          SubscriptionOptions
        } from 'ts-nats';

        ${channelImport.join('')}
        ${messagesImport.join('')}

        import * as events from 'events';
        export enum AvailableEvents {
          permissionError = 'permissionError',
          close = 'close',
          connect = 'connect',
          connecting = 'connecting',
          disconnect = 'disconnect',
          error = 'error',
          pingcount = 'pingcount',
          pingtimer = 'pingtimer',
          reconnect = 'reconnect',
          reconnecting = 'reconnecting',
          serversChanged = 'serversChanged',
          subscribe = 'subscribe',
          unsubscribe = 'unsubscribe',
          yield = 'yield'
        }

        export declare interface NatsAsyncApiTestClient {
          ${Events()}
        }

        export class NatsAsyncApiTestClient extends events.EventEmitter{
          ${Standard(asyncapi)}
          ${getChannelWrappers(asyncapi, params).join('')}
        }
        `
      }
    </File>
  );
}