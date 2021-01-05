
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

        
      import * as streetlightStreetlightIdCommandTurnonChannel from "./testchannels/StreetlightStreetlightIdCommandTurnon";
      export {streetlightStreetlightIdCommandTurnonChannel};
    ,
      import * as streetlightStreetlightIdEventTurnonChannel from "./testchannels/StreetlightStreetlightIdEventTurnon";
      export {streetlightStreetlightIdEventTurnonChannel};
    
        
      import * as TurnonCommandMessage from "../../messages/TurnonCommand";
      export {TurnonCommandMessage};
    ,
      import * as AnonymousMessage2Message from "../../messages/AnonymousMessage2";
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

        export declare interface NatsAsyncApiTestClient {
          [object Object]
        }

        export class NatsAsyncApiTestClient extends events.EventEmitter{
          [object Object]
          [object Object],[object Object]
        }
        