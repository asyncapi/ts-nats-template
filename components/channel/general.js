
import { messageHasNotNullPayload, pascalCase, getSchemaFileName } from '../../utils/index';

export function General( channel, publishMessage, subscribeMessage, path){
  // Import the correct messages
  let publishMessageImport = '';
  if(channel.hasPublish() && messageHasNotNullPayload(publishMessage.payload())){
    const publishMessageUid = getSchemaFileName(publishMessage.payload().uid());
    publishMessageImport = `import {${publishMessageUid}} from '${path}/schemas/${pascalCase(publishMessageUid)}';`
  }
  let subscribeMessageImport = '';
  if(channel.hasSubscribe() && messageHasNotNullPayload(subscribeMessage.payload())){
    const subscribeMessageUid = getSchemaFileName(subscribeMessage.payload().uid());
    subscribeMessageImport = `import {${subscribeMessageUid}} from '${path}/schemas/${pascalCase(subscribeMessageUid)}';`
  }

  return `
${publishMessageImport}
${subscribeMessageImport}

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '${path}/NatsTypescriptTemplateError';
import { Hooks } from '${path}/hooks';

  `
}
