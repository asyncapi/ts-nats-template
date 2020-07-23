
import * as AnonymousMessage1Message from '../../../messages/AnonymousMessage1';
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../../../NatsTypescriptTemplateError';
import { Hooks } from '../../../hooks';
  
export function subscribe(
  onDataCallback : (err?: NatsTypescriptTemplateError, msg?: AnonymousMessage1Message.AnonymousMessage1, streetlight_id?: string) => void, 
  nc: Client,
  
    streetlight_id: string
  
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    let subscribeOptions: SubscriptionOptions = {};

    try{
      let subscription = nc.subscribe(`streetlight.${streetlight_id}.event.turnon`, (err, msg) => {
        if(err){
          onDataCallback(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, err));
        }else{
          const unmodifiedChannel = `streetlight.{streetlight_id}.event.turnon`
          const receivedTopicParameters = {
              streetlight_id : msg.subject.slice(unmodifiedChannel.split("${streetlight_id}")[0].length, msg.subject.length-unmodifiedChannel.split("${streetlight_id}")[1].length)
          }
          try{
            let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
            var processedDataReceived: any = msg.data;
            for(let hook of receivedDataHooks){
              processedDataReceived = hook(processedDataReceived);
            }
          }catch(e){
            reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e));
            return;
          }
          let publishedData = AnonymousMessage1Message.Convert.toAnonymousMessage1(processedDataReceived);
          onDataCallback(undefined, publishedData,
                receivedTopicParameters['streetlight_id']);
        }
      }, subscribeOptions);
      resolve(subscription);
    }catch(e){
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}


