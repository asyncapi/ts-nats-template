
import {default as DimLightResponseMessage} from '../../../messages/DimLightResponse'
import {default as DimLightMessage} from '../../../messages/DimLight'

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import * as utils from '../utils';
  
export function request(
  requestMessage: DimLightMessage,
  
    streetlightId:string
  ,
  nc?: Client): Promise<DimLightResponseMessage> {
  return new Promise<DimLightResponseMessage>(async (resolve, reject) => {
    if (nc) {
      try {
        let inbox = nc.createInbox();
        await nc.subscribe(inbox, (err, msg) => {
          if (err) {
            reject(err);
          } else {
            let processedData = utils.processRecievedData(msg.data, Payload.STRING, 'STRING');
            resolve(DimLightResponseMessage.toMessage(processedData));
          }
        }, { max: 1 });
        let publishDataHooks = getHooks(AvailableHooks.BeforeSendingData);
        let publishDataHooks = hooks.getHooks(AvailableHooks.BeforeSendingData) as hooks.BeforeSendingDataHook[];
        var requestData;
        for(let hook in publishDataHooks){
          requestData = hook(requestMessage);
        }
        nc.publish(realizeChannelName('smartylighting/streetlights/1/0/action/{streetlightId}/dim', {
          
            "streetlightId": streetlightId
          
        }), requestData, inbox);
      }catch(e){
        reject(e);
      }
    } else {
      reject(new Error("Nats client is not connected"));
    }
  })
}


