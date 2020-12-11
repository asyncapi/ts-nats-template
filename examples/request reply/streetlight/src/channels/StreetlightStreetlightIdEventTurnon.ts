
import * as GeneralReplyMessage from '../messages/GeneralReply'
import * as AnonymousMessage4Message from '../messages/AnonymousMessage4'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function request(
  message: AnonymousMessage4Message.AnonymousMessage4,
  nc: Client
  
    ,streetlight_id: string
  
  ): Promise<GeneralReplyMessage.GeneralReply> {
  return new Promise(async (resolve, reject) => {
    var timeout = undefined;
    let msg;
    try {
      
try{
  let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
  var dataToSend : any = message;
  for(let hook of beforeSendingHooks){
    dataToSend = hook(dataToSend);
  }
}catch(e){
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  throw error;
}

      msg = await nc.request(`streetlight.${streetlight_id}.event.turnon`, timeout, dataToSend)
    }catch(e){
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      return;
    }
    
try {
  let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  throw error;
}

    resolve(receivedData);
  })
}


