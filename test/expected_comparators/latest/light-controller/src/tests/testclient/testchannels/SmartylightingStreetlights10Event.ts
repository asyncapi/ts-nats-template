
import {default as LightMeasuredMessage} from '#messages/LightMeasured'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import { Hooks } from '#hooks';
  

export function publish(
  requestMessage: LightMeasuredMessage,
  nc: Client,
  
  ): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    if (nc) {
      try{
        let publishDataHooks = Hooks.getInstance().getBeforeSendingDataHook();
        var dataToPublish : any = requestMessage;
        for(let hook of publishDataHooks){
          dataToPublish = hook(dataToPublish);
        }
        nc.publish(`smartylighting.streetlights.1.0.event.*`, dataToPublish);
        resolve();
      }catch(e){
        reject(e);
      }
    }else{
      reject(new Error("Nats client is not connected"));
    }
  });
};

