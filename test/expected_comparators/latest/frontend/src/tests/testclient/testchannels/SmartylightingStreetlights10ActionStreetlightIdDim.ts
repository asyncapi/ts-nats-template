
import {default as DimLightResponseMessage} from '#messages/DimLightResponse'
import {default as DimLightMessage} from '#messages/DimLight'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import { Hooks } from '#hooks';
  
export function request(
  requestMessage: DimLightMessage,
  nc: Client,
  
    streetlightId: string
  
  ): Promise<DimLightResponseMessage> {
  return new Promise<DimLightResponseMessage>(async (resolve, reject) => {
    if (nc) {
      try {
        let inbox = nc.createInbox();
        await nc.subscribe(inbox, (err, msg) => {
          if (err) {
            reject(err);
          } else {
            let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
            var processedDataReceived : any = msg.data;
            for(let hook of receivedDataHooks){
              processedDataReceived = hook(processedDataReceived);
            }
            resolve(DimLightResponseMessage.toMessage(processedDataReceived));
          }
        }, { max: 1 });
        let publishDataHooks = Hooks.getInstance().getBeforeSendingDataHook();
        var requestData : any = requestMessage;
        for(let hook of publishDataHooks){
          requestData = hook(requestData);
        }
        nc.publish(`smartylighting.streetlights.1.0.action.${streetlightId}.dim`, requestData, inbox);
      }catch(e){
        reject(e);
      }
    } else {
      reject(new Error("Nats client is not connected"));
    }
  })
}


