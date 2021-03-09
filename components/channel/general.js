
import { messageHasNotNullPayload, getSchemaFileName } from '../../utils/index';

/**
 * 
 * @param {*} channel 
 * @param {*} publishMessage 
 * @param {*} subscribeMessage 
 * @param {*} path 
 */
export function General(channel, publishMessage, subscribeMessage, path) {
  // Import the correct messages
  let publishMessageImport = '';
  if (channel.hasPublish() && messageHasNotNullPayload(publishMessage.payload())) {
    const publishMessageUid = getSchemaFileName(publishMessage.payload().uid());
    publishMessageImport = `import {${publishMessageUid}} from '${path}/schemas/${publishMessageUid}';`;
  }
  let subscribeMessageImport = '';
  if (channel.hasSubscribe() && messageHasNotNullPayload(subscribeMessage.payload())) {
    const subscribeMessageUid = getSchemaFileName(subscribeMessage.payload().uid());
    subscribeMessageImport = `import {${subscribeMessageUid}} from '${path}/schemas/${subscribeMessageUid}';`;
  }

  return `
${publishMessageImport}
${subscribeMessageImport}

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '${path}/NatsTypescriptTemplateError';
import { Hooks } from '${path}/hooks';
  `;
}
