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
    const publishMessage = channel.publish().message(0);
    const subscribeMessage = channel.subscribe().message(0);
    if (isRequestReply(channel)) {
      if (isRequester(channel)) {
        return Request(
          asyncapi.defaultContentType(), 
          channelName, 
          subscribeMessage,
          publishMessage,
          channel.description(),
          channel.parameters()
        );
      }
      if (isReplier(channel)) {
        return Reply(
          asyncapi.defaultContentType(), 
          channelName, 
          subscribeMessage,
          publishMessage,
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
          subscribeMessage, 
          channel.description(), 
          channel.parameters());
      }
      if (channel.hasPublish()) {
        return Subscribe(
          asyncapi.defaultContentType(), 
          channelName, 
          publishMessage, 
          channel.description(), 
          channel.parameters());
      }
    }
  }) : '';
  return channelWrappers;
}


export default function index({ asyncapi, params }) {
  //Import the channel and messages and re-export them
  const importList = [];
  const exportList = [];
  for (const [channelName] of Object.entries(asyncapi.channels())){
    const camelCaseChannelName = camelCase(channelName);
    importList.push(`import * as ${camelCaseChannelName}Channel from "./channels/${pascalCase(channelName)}";`);
    exportList.push(`export {${camelCaseChannelName}Channel};`);
  }

  //Import the messages and re-export them
  for (const [messageName] of asyncapi.allMessages()) {
    const pascalMessageName = pascalCase(messageName);
    importList.push(`import * as ${pascalMessageName}Message from "./messages/${pascalMessageName}";`);
    exportList.push(`export {${pascalMessageName}Message};`);
  }

  return (
    <File name="index.ts">
{`
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

${importList.join('')}
${exportList.join('')}

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
`}
    </File>
  );
}