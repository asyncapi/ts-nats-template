
import {default as TurnOnOffResponseMessage} from '../messages/TurnOnOffResponse'
import {default as TurnOnOffMessage} from '../messages/TurnOnOff'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {realizeChannelName} from './utils';
import * as hooks from '#hooks';
  
export function reply(
  onRequest: (err?: NatsError, msg?: TurnOnOffMessage) => TurnOnOffResponseMessage, 
  onReplyError: (err: NatsError) => void,
  ,
  
    streetlightId:string
  ,
  nc?: Client): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    if (nc) {
      try {

        let subscribeOptions: SubscriptionOptions = {};

        let subscription = nc.subscribe(realizeChannelName('smartylighting/streetlights/1/0/action/{streetlightId}/turn/off', {
          
            "streetlightId": streetlightId
          
        }), (err, msg) => {
          if (err) {
            onRequest(err);
          } else {
            let processedData = utils.processRecievedData(msg.data, Payload.STRING, 'STRING');
            let requestData = new TurnOnOffMessage();
            requestData.copyFrom(processedData);

            let responseObject = onRequest(undefined, requestData);
            if (msg.reply) {
              try {
                let requestData = utils.beforeResponse(responseObject, Payload.STRING, 'STRING');
                nc.publish(msg.reply, requestData);
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
                console.error(error)
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


