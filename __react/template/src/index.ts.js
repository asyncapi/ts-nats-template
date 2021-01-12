import { File } from '@asyncapi/generator-react-sdk';
import { Events } from '../../components/events';
import { Standard } from '../../components/index/standard';
import { Publish } from '../../components/index/publish';
import { Subscribe } from '../../components/index/subscribe';
import { Reply } from '../../components/index/reply';
import { Request } from '../../components/index/request';
import { camelCase, pascalCase, isRequestReply, isReplier, isRequester, isPubsub} from '../../utils/index';

// eslint-disable-next-line sonarjs/cognitive-complexity
/**
 * Return the correct channel functions for the client based on whether a channel is `pubSub` or `requestReply`.
 * 
 * @param {*} asyncapi 
 * @param {*} params 
 */
function getChannelWrappers(asyncapi, params) {
  let channelWrappers = [];
  channelWrappers = Object.keys(asyncapi.channels()).length ? Object.entries(asyncapi.channels()).map(([channelName, channel]) => {
    if (isRequestReply(channel)) {
      if (isRequester(channel)) {
        return Request(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.subscribe().message(0),
          channel.publish().message(0),
          channel.description(),
          channel.parameters()
        );
      }
      if (isReplier(channel)) {
        return Reply(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.subscribe().message(0),
          channel.publish().message(0),
          channel.description(),
          channel.parameters(),
          params
        );
      }
    }

    if (isPubsub(channel)) {
      if (channel.hasSubscribe()) {
        return Publish(
          asyncapi.defaultContentType(), 
          channelName, 
          channel.subscribe().message(0), 
          channel.description(), 
          channel.parameters());
      }
      if (channel.hasPublish()) {
        return Subscribe(
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


export default function index({ asyncapi, params }) {
  //Import the channel code and re-export them
  let channelImport = asyncapi.channels();
  channelImport = Object.keys(channelImport).length ? Object.entries(channelImport).map(([channelName, _]) => {
    return `
      import * as ${camelCase(channelName)}Channel from "./channels/${pascalCase(channelName)}";
      export {${camelCase(channelName)}Channel};
    `;
  }) : '';

  //Import the messages and re-export them
  const messagesImport = [];
  for (const [messageName] of asyncapi.allMessages()) {
    const pascalMessageName = pascalCase(messageName);
    messagesImport.push(`
      import * as ${pascalMessageName}Message from "./messages/${pascalMessageName}";
      export {${pascalMessageName}Message};
    `);
  }

  return (
    <File name="index.ts">
      {
        `
        import {fromSeed} from 'ts-nkeys';
        import {AvailableHooks, receivedDataHook, BeforeSendingDataHook, Hooks} from './hooks';
        export {AvailableHooks, receivedDataHook, BeforeSendingDataHook, Hooks}
        import * as TestClient from './tests/testclient/';
        export {TestClient};
        import {ErrorCode, NatsTypescriptTemplateError} from './NatsTypescriptTemplateError';
        export {ErrorCode, NatsTypescriptTemplateError}
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
          
        export {Client, ServerInfo, ServersChangedEvent, SubEvent}

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

        export declare interface NatsAsyncApiClient {
          ${Events()}
        }

        export class NatsAsyncApiClient extends events.EventEmitter{
          ${Standard(asyncapi)}
          ${getChannelWrappers(asyncapi, params).join('')}
        }
        `
      }
    </File>
  );
}