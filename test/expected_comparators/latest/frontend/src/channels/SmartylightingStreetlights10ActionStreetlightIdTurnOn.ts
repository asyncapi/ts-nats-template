
import {default as TurnOnOffResponseMessage} from '#messages/TurnOnOffResponse'
import {default as TurnOnOffMessage} from '#messages/TurnOnOff'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import { Hooks } from '#hooks';
  
export function reply(
  onRequest: (err?: NatsError, msg?: TurnOnOffMessage, streetlightId?: string) =>Promise<TurnOnOffResponseMessage>, 
  onReplyError: (err: NatsError) => void,
  nc: Client,
  
    streetlightId: string
  
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    if (nc) {
      try {
        let subscribeOptions: SubscriptionOptions = {};

        let subscription = nc.subscribe(`smartylighting.streetlights.1.0.action.${streetlightId}.turn.on`,async (err, msg) => {
          if (err) {
            onRequest(err);
          } else {
            const unmodifiedChannel = `smartylighting.streetlights.1.0.action.{streetlightId}.turn.on`
            const receivedTopicParameters = {
                streetlightId : msg.subject.slice(unmodifiedChannel.split("${streetlightId}")[0].length, msg.subject.length-unmodifiedChannel.split("${streetlightId}")[1].length)
            }
            let receivedDataHooks = Hooks.getInstance().getRecievedDataHook();
            var processedDataReceived : any = msg.data;
            for(let hook of receivedDataHooks){
              processedDataReceived = hook(processedDataReceived);
            }
            let requestData = TurnOnOffMessage.toMessage(processedDataReceived);
            let responseObject =await onRequest(undefined, requestData,
                receivedTopicParameters['streetlightId']);
            if (msg.reply) {
              try {
                let publishDataHooks = Hooks.getInstance().getBeforeSendingDataHook();
                var dataToPublish : any = responseObject;
                for(let hook of publishDataHooks){
                  dataToPublish = hook(dataToPublish);
                }
                nc.publish(msg.reply, dataToPublish);
              } catch (e) {
                if (onReplyError) {
                  onReplyError(e)
                } else {
                  console.error(e)
                }
              }
            } else {
              let error = new NatsError('Expected request to need a reply, did not..', '000');
              if (onReplyError) {
                onReplyError(error)
              } else { 
              }
            }
          }
        }, subscribeOptions);
        resolve(subscription);
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error("Nats client is not connected"));
    }
  })
}


