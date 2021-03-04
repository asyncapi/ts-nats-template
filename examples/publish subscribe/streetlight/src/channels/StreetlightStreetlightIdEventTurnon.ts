


import {AnonymousSchema_5} from '../schemas/AnonymousSchema_5';

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';

  


    export function publish(
      message: AnonymousSchema_5,
      nc: Client
      ,streetlight_id: string
      ): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        try{
          let dataToSend : any = message;
          
      
  try {
    let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
    for(let hook of beforeSendingHooks){
      dataToSend = hook(dataToSend);
    }
    
    
  } catch(e) {
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
    
    