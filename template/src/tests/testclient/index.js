import { File, Text } from "@asyncapi/generator-react-sdk";
import { Events } from "../../../../components/events";
import { Bracket } from "../../../../components/bracket";
import { Standard } from "../../../../components/index/standard";
import { Publish } from "../../../../components/index/publish";
import { camelCase, pascalCase, firstUpperCase, isRequestReply, isReplier, isRequester, isPubsub} from "../../../../utils/general";

export default function({ asyncapi, params }) {
  let channelImport = asyncapi.channels();
  channelImport = Object.keys(channelImport).length ? Object.entries(channelImport).map(([channelName, _]) => {
    return <Text>
      import * as {camelCase(channelName)}Channel from "./testchannels/{firstUpperCase(pascalCase(channelName))}";
      export <Bracket>{ camelCase(channelName) }Channel</Bracket>;
    </Text>
  }) : <Text></Text>;

  let messagesImport = [];
  for (var [messageName, _] of asyncapi.allMessages()) {
    let pascalMessageName = pascalCase(messageName);
    messagesImport.push(<Text>
      import * as {pascalMessageName}Message from "../../messages/{pascalMessageName}";
      export <Bracket>{pascalMessageName}Message</Bracket>;
    </Text>);
  }

  let channelWrappers = asyncapi.channels();
  channelWrappers = Object.keys(channelWrappers).length ? Object.entries(channelWrappers).map(([channelName, channel]) => {
    if(isRequestReply(channel)){
      if(isRequester(channel)){

      }
      if(isReplier(channel)){

      }
    }

    if(isPubsub(channel)){
      if(channel.hasSubscribe()){

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
  }) : <Text></Text>;

  return (
    <File name="index.ts">
      <Text>
        import <Bracket>fromSeed</Bracket> from 'ts-nkeys';
        
        import <Bracket>ErrorCode, NatsTypescriptTemplateError</Bracket> from '../../NatsTypescriptTemplateError';
        import <Bracket> 
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
          </Bracket> from 'ts-nats';
      </Text>

      {channelImport}
      {messagesImport}

      <Text>
        import * as events from 'events';
        export enum AvailableEvents <Bracket>
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
        </Bracket>

        export declare interface NatsAsyncApiTestClient <Bracket>
          <Events />
        </Bracket>

        export class NatsAsyncApiTestClient extends events.EventEmitter<Bracket>
          <Standard asyncapi={asyncapi}/>
          {channelWrappers}
        </Bracket>
      </Text>
    </File>
  );
}