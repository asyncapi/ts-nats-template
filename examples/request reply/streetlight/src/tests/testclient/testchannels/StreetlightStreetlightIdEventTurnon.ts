
import * as GeneralReplyMessage from '../../../messages/GeneralReply';
import * as AnonymousMessage3Message from '../../../messages/AnonymousMessage3';
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../../../NatsTypescriptTemplateError';
import { Hooks } from '../../../hooks';
  
export function reply(
    onRequest: (err?: NatsTypescriptTemplateError, msg?: AnonymousMessage3Message.AnonymousMessage3, streetlight_id?: string) =>Promise<GeneralReplyMessage.GeneralReply>, 
    onReplyError: (err: NatsTypescriptTemplateError) => void,
    nc: Client
    
      ,streetlight_id: string
    ,
    options?: SubscriptionOptions
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: SubscriptionOptions = {... options};

      let subscription = nc.subscribe(`streetlight.${streetlight_id}.event.turnon`,async (err, msg) => {
        if (err) {
          onRequest(err);
        } else {
          const unmodifiedChannel = `streetlight.{streetlight_id}.event.turnon`
          const receivedTopicParameters = {
              streetlight_id : msg.subject.slice(unmodifiedChannel.split("{streetlight_id}")[0].length, msg.subject.length-unmodifiedChannel.split("{streetlight_id}")[1].length)
          }
          
try {
  let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  onReplyError(error);
  return;
}


          let message =await onRequest(undefined, receivedData,
              receivedTopicParameters['streetlight_id']);
          
          if (msg.reply) {
            
try{
  let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
  var dataToSend : any = message;
  for(let hook of beforeSendingHooks){
    dataToSend = hook(dataToSend);
  }
}catch(e){
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  onReplyError(error)
  return;
}

            
            await nc.publish(msg.reply, dataToSend);
          } else {
            let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
            onReplyError(error)
            return;
          }
        }
      }, subscribeOptions);
      resolve(subscription);
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}


