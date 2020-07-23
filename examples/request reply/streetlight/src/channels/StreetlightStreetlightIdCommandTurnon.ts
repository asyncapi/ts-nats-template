
import * as SubscribeToTurnonCommandMessage from '../messages/SubscribeToTurnonCommand'
import * as GeneralReplyMessage from '../messages/GeneralReply'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function reply(
  onRequest: (err?: NatsTypescriptTemplateError, msg?: SubscribeToTurnonCommandMessage.SubscribeToTurnonCommand, streetlight_id?: string) =>Promise<GeneralReplyMessage.GeneralReply>, 
  onReplyError: (err: NatsTypescriptTemplateError) => void,
  nc: Client,
  
    streetlight_id: string
  
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: SubscriptionOptions = {};

      let subscription = nc.subscribe(`streetlight.${streetlight_id}.command.turnon`,async (err, msg) => {
        if (err) {
          onRequest(err);
        } else {
          const unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`
          const receivedTopicParameters = {
              streetlight_id : msg.subject.slice(unmodifiedChannel.split("{streetlight_id}")[0].length, msg.subject.length-unmodifiedChannel.split("{streetlight_id}")[1].length)
          }
          
try {
  let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  onReplyError(NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e))
  return;
}

          let requestData = SubscribeToTurnonCommandMessage.Convert.toSubscribeToTurnonCommand(receivedData);
          let message =await onRequest(undefined, requestData,
              receivedTopicParameters['streetlight_id']);
          
          if (msg.reply) {
            
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

            nc.publish(`streetlight.${streetlight_id}.command.turnon`, dataToSend);
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


