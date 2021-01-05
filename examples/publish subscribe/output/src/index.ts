
        import {fromSeed} from 'ts-nkeys';
        import {AvailableHooks, receivedDataHook, BeforeSendingDataHook, Hooks} from './hooks';
        export {AvailableHooks, receivedDataHook, BeforeSendingDataHook, Hooks}
        import * as TestClient from './tests/testclient/';
        export {% raw %}{{% endraw %} TestClient {% raw %}}{% endraw %};
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

        
      import * as streetlightStreetlightIdCommandTurnonChannel from "./channels/StreetlightStreetlightIdCommandTurnon";
      export {streetlightStreetlightIdCommandTurnonChannel};
    ,
      import * as streetlightStreetlightIdEventTurnonChannel from "./channels/StreetlightStreetlightIdEventTurnon";
      export {streetlightStreetlightIdEventTurnonChannel};
    
        
      import * as TurnonCommandMessage from "./messages/TurnonCommand";
      export {TurnonCommandMessage};
    ,
      import * as AnonymousMessage2Message from "./messages/AnonymousMessage2";
      export {AnonymousMessage2Message};
    

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
          [object Object]
        }

        export class NatsAsyncApiClient extends events.EventEmitter{
          [object Object]
          [object Object],[object Object]
        }
        