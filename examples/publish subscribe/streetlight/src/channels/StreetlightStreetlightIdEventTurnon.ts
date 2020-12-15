
import * as AnonymousMessage2Message from '../messages/AnonymousMessage2'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function publish(
  message: AnonymousMessage2Message.AnonymousMessage2,
  nc: Client
  
    ,streetlight_id: string
  
  ): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try{
      
try {
  let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
  var dataToSend : any = message;
  for(let hook of beforeSendingHooks){
    dataToSend = hook(dataToSend);
  }
} catch(e){
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  throw error;
}

      await nc.publish(`streetlight.${streetlight_id}.event.turnon`, dataToSend);
      resolve();
    }catch(e){
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  });
};

