
import {default as LightMeasuredMessage} from '#messages/LightMeasured'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import { Hooks } from '#hooks';
  
export function subscribe(
  onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage) => void, 
  nc: Client,
  
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    try{
      let subscribeOptions: SubscriptionOptions = {};

      let subscription = nc.subscribe(`smartylighting.streetlights.1.0.event.*`, (err, msg) => {
        if(err){
          onDataCallback(err);
        }else{
          let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
          var processedDataReceived: any = msg.data;
          for(let hook of receivedDataHooks){
            processedDataReceived = hook(processedDataReceived);
          }
          let publishedData = LightMeasuredMessage.toMessage(processedDataReceived);
          onDataCallback(undefined, publishedData);
        }
      }, subscribeOptions);
      resolve(subscription);
    }catch(e){
      reject(e);
    }
  })
}


