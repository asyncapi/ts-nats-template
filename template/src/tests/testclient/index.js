import { File, Text } from "@asyncapi/generator-react-sdk";
import { Events } from "../../../../components/events";
import { Bracket } from "../../../../components/bracket";
import { Standard } from "../../../../components/index/standard";
import { Publish } from "../../../../components/index/publish";
import { Subscribe } from "../../../../components/index/subscribe";
import { Reply } from "../../../../components/index/reply";
import { Request } from "../../../../components/index/request";
import { camelCase, pascalCase, firstUpperCase, isRequestReply, isReplier, isRequester, isPubsub} from "../../../../utils/general";

export default function({ asyncapi, params }) {
  let channelImport = asyncapi.channels();
  channelImport = Object.keys(channelImport).length ? Object.entries(channelImport).map(([channelName, _]) => {
    return `
      import * as ${camelCase(channelName)}Channel from "./testchannels/${firstUpperCase(pascalCase(channelName))}";
      export {${camelCase(channelName)}Channel};
    `
  }) : ``;

  let messagesImport = [];
  for (var [messageName, _] of asyncapi.allMessages()) {
    let pascalMessageName = pascalCase(messageName);
    messagesImport.push(`
      import * as ${pascalMessageName}Message from "../../messages/${pascalMessageName}";
      export {${pascalMessageName}Message};
    `);
  }

  let channelWrappers = asyncapi.channels();
  channelWrappers = Object.keys(channelWrappers).length ? Object.entries(channelWrappers).map(([channelName, channel]) => {
    if(isRequestReply(channel)){
      if(isRequester(channel)){
        return <Reply 
          defaultContentType={asyncapi.defaultContentType()} 
          channelName={channelName} 
          replyMessage={channel.publish().message(0)} 
          receiveMessage={channel.subscribe().message(0)} 
          messageDescription={channel.description()} 
          channelParameters={channel.parameters()} 
          params={params}/>
      }
      if(isReplier(channel)){
        return <Request 
          defaultContentType={asyncapi.defaultContentType()} 
          channelName={channelName} 
          requestMessage={channel.publish().message(0)} 
          replyMessage={channel.subscribe().message(0)} 
          messageDescription={channel.description()} 
          channelParameters={channel.parameters()} />
      }
    }

    if(isPubsub(channel)){
      if(channel.hasSubscribe()){
        return <Subscribe 
          defaultContentType={asyncapi.defaultContentType()} 
          channelName={channelName} 
          message={channel.subscribe().message(0)} 
          messageDescription={channel.description()} 
          channelParameters={channel.parameters()} />
      }
      if(channel.hasPublish()){
        return <Publish 
          defaultContentType={asyncapi.defaultContentType()} 
          channelName={channelName} 
          message={channel.publish().message(0)} 
          messageDescription={channel.description()} 
          channelParameters={channel.parameters()} />
      }
    }
  }) : ``;

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

        ${channelImport}
        ${messagesImport}

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
          ${<Events />}
        }

        export class NatsAsyncApiTestClient extends events.EventEmitter{
          ${<Standard asyncapi={asyncapi}/>}
          ${channelWrappers}
        }
        `
      }
    </File>
  );
}