import { unwrap } from './ChannelParameterUnwrap';
import { realizeChannelName, camelCase, includeUnsubAfterForSubscription, messageHasNotNullPayload, getMessageType, realizeParametersForChannelWrapper, includeQueueForSubscription, shouldPromisifyCallbacks, renderJSDocParameters } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, ChannelParameter } from '@asyncapi/parser';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 * @property {boolean} promisifyReplyCallback - whether or not reply callbacks should be promisify.
 */

/**
 * Component which returns a function which sets up a reply for a given channel
 * 
 * @param {string} channelName to reply to
 * @param {Message} replyMessage used to reply to request
 * @param {Message} receiveMessage which is received by the request 
 * @param {Object.<string, ChannelParameter>} channelParameters parameters to the channel
 * @param {TemplateParameters} params template parameters
 */
export function Reply(channelName, replyMessage, receiveMessage, channelParameters, params, operation) {
  const replyMessageType = getMessageType(replyMessage);
  const receiveMessageType = getMessageType(receiveMessage);
  //Create an array of all the parameter names
  let parameters = [];
  parameters = Object.entries(channelParameters).map(([parameterName, _]) => {
    return `${camelCase(parameterName)}Param`;
  });

  //Determine the receiving process based on whether the payload type is null
  let receivingOperation = `let message = ${shouldPromisifyCallbacks(params) ? 'await' : ''} onRequest(undefined, null ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});`;
  if (messageHasNotNullPayload(receiveMessage.payload())) {
    receivingOperation =  `
    let receivedData : any = codec.decode(msg.data);
    let replyMessage = ${shouldPromisifyCallbacks(params) ? 'await' : ''} onRequest(undefined, ${receiveMessageType}.unmarshal(receivedData) ${parameters.length > 0 ? `, ${parameters.join(',')}` : ''});
    `;
  }

  //Determine the reply process based on whether the payload type is null
  let replyOperation = 'msg.respond(Nats.Empty);';
  if (messageHasNotNullPayload(replyMessage.payload())) {
    replyOperation = `
    let dataToSend : any = replyMessage.marshal();
    dataToSend = codec.encode(dataToSend);
    msg.respond(dataToSend);
    `;
  }
  
  return `
  /**
   * Internal functionality to setup reply to the \`${channelName}\` channel
   * 
   * @param onRequest called when request is received
   * @param onReplyError called when it was not possible to send the reply
   * @param client to setup reply with
   * @param codec used to convert messages
   ${renderJSDocParameters(channelParameters)}
   * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
   */
    export function reply(
      onRequest : (
        err?: NatsTypescriptTemplateError, 
        msg?: ${getMessageType(receiveMessage)}
        ${realizeParametersForChannelWrapper(channelParameters, false)}
      ) => ${shouldPromisifyCallbacks(params) ? 'Promise<' : ''}${replyMessageType}${ shouldPromisifyCallbacks(params) ? '>' : ''}, 
      onReplyError: (err: NatsTypescriptTemplateError) => void,
      nc: Nats.NatsConnection,
      codec: Nats.Codec<any>
      ${realizeParametersForChannelWrapper(channelParameters)}, 
      options?: Nats.SubscriptionOptions
    ): Promise<Nats.Subscription> {
    return new Promise(async (resolve, reject) => {
      try {
        let subscribeOptions: Nats.SubscriptionOptions = {... options};
        
        ${includeQueueForSubscription(operation)}
        ${includeUnsubAfterForSubscription(operation)}
  
        let subscription = nc.subscribe(${realizeChannelName(channelParameters, channelName)}, subscribeOptions);

        (async () => {
          for await (const msg of subscription) {
            
            ${unwrap(channelName, channelParameters)}

            ${receivingOperation}

            if (msg.reply) {
              ${replyOperation}
            } else {
              let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
              onReplyError(error)
              return;
            }
          }
        })();
        resolve(subscription);
      } catch (e: any) {
        reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      }
    })
  }
    `;
}
