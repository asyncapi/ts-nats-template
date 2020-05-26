
import {default as LightMeasuredMessage} from '#messages/LightMeasured'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import { Hooks } from '#hooks';
  
export function subscribe(
  onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage, streetlightId?: string) => void, 
  nc: Client,
  
    streetlightId: string
  
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    try{
      let subscribeOptions: SubscriptionOptions = {};

      let subscription = nc.subscribe(`smartylighting.streetlights.1.0.event.${streetlightId}.lighting.measured`, (err, msg) => {
        if(err){
          onDataCallback(err);
        }else{
          const unmodifiedChannel = `smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured`
          const receivedTopicParameters = {
              streetlightId : msg.subject.slice(unmodifiedChannel.split("${streetlightId}")[0].length, msg.subject.length-unmodifiedChannel.split("${streetlightId}")[1].length)
          }
          let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
          var processedDataReceived: any = msg.data;
          for(let hook of receivedDataHooks){
            processedDataReceived = hook(processedDataReceived);
          }
          let publishedData = LightMeasuredMessage.toMessage(processedDataReceived);
          onDataCallback(undefined, publishedData,
                receivedTopicParameters['streetlightId']);
        }
      }, subscribeOptions);
      resolve(subscription);
    }catch(e){
      reject(e);
    }
  })
}


