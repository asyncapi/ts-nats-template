
import {default as LightMeasuredMessage} from '../../../messages/LightMeasured'

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import * as utils from '../utils';
  

export function publish(
  requestMessage: LightMeasuredMessage, 
  
    streetlightId:string
  ,
  nc?: Client
  ): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    if (nc) {
      try{
        let publishDataHooks = hooks.getHooks(AvailableHooks.BeforeSendingData) as hooks.BeforeSendingDataHook[];
        var dataToPublish;
        for(let hook in publishDataHooks){
          dataToPublish = hook(requestMessage);
        }
        nc.publish(realizeChannelName('smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured', {
          
            "streetlightId": streetlightId
          
        }), dataToPublish);
        resolve();
      }catch(e){
        reject(e);
      }
    }else{
      reject(new Error("Nats client is not connected"));
    }
  });
};

