
import * as GeneralReplyMessage from '../messages/GeneralReply'
import * as AnonymousMessage3Message from '../messages/AnonymousMessage3'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function request(
  message: AnonymousMessage3Message.AnonymousMessage3,
  nc: Client,
  
    streetlight_id: string
  
  ): Promise<GeneralReplyMessage.GeneralReply> {
  return new Promise(async (resolve, reject) => {
    
    let msg;
    try {
      
try{
  let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
  var dataToSend : any = message;
  for(let hook of beforeSendingHooks){
    dataToSend = hook(dataToSend);
  }
}catch(e){
  reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e));
  return;
}

      msg = await nc.request(`streetlight.${streetlight_id}.event.turnon`, undefined, dataToSend)
    }catch(e){
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      return;
    }
    
try {
  let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e));
  return;
}

    let recievedData = GeneralReplyMessage.Convert.toGeneralReply(receivedData);
    resolve(recievedData);
  })
}


