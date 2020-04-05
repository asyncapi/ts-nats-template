
import {default as LightMeasuredMessage} from '../messages/LightMeasured'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {realizeChannelName} from './utils';
import * as hooks from '#hooks';
  

import {getHooks, AvailableHooks} from '#hooks';
export function subscribe(
  onDataCallback : (err?: NatsError, msg?: lightMeasured) => void, 
  
    streetlightId:string
  ,
  nc?: Client): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    if (nc) {
      try{
        let subscribeOptions: SubscriptionOptions = {};

        let subscription = nc.subscribe(realizeChannelName('smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured', {
          
            "streetlightId": streetlightId
          
        }), (err, msg) => {
          if(err){
            onDataCallback(err);
          }else{
            let processedData = utils.processRecievedData(msg.data, Payload.STRING, 'STRING');
            let publishedData = new lightMeasured();
            publishedData.copyFrom(processedData);
            onDataCallback(undefined, publishedData);
          }
        }, subscribeOptions);
        resolve(subscription);
      }catch(e){
        reject(e);
      }
    }else{
      reject(new Error("Nats client is not connected"));
    }
  })
}


