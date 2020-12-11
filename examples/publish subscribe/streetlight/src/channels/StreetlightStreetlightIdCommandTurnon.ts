
import * as TurnonCommandMessage from '../messages/TurnonCommand'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function subscribe(
    onDataCallback : (err?: NatsTypescriptTemplateError, msg?: TurnonCommandMessage.TurnonCommand, streetlight_id?: string) => void, 
    nc: Client
    
      ,streetlight_id: string
    , 
    options?: SubscriptionOptions
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    let subscribeOptions: SubscriptionOptions = {... options};

    try{
      let subscription = await nc.subscribe(`streetlight.${streetlight_id}.command.turnon`, (err, msg) => {
        if(err){
          onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
        }else{
          
var unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
var channel = msg.subject;
	var streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");

const splits = [
		streetlightIdSplit[0],
		streetlightIdSplit[1]
];
channel = channel.substring(splits[0].length);
var streetlightIdEnd = channel.indexOf(splits[1]);
var streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);

          
try {
  let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  throw error;
}

          onDataCallback(undefined, receivedData,
                streetlightIdParam);
        }
      }, subscribeOptions);
      resolve(subscription);
    }catch(e){
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}


