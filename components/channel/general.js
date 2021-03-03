
import { messageHasNotNullPayload, pascalCase } from '../../utils/index';

export function General( channel, publishMessage, subscribeMessage, path){
  // Import the correct messages
  let publishMessageImport = '';
  if(channel.hasPublish() && messageHasNotNullPayload(publishMessage.payload())){
    const publishMessageUid = publishMessage.uid();
    publishMessageImport = `import * as ${pascalCase(publishMessageUid)}Message from '${path}/messages/${pascalCase(publishMessageUid)}'`
  }
  let subscribeMessageImport = '';
  if(channel.hasSubscribe() && messageHasNotNullPayload(subscribeMessage.payload())){
    const subscribeMessageUid = subscribeMessage.uid();
    subscribeMessageImport = `import * as ${pascalCase(subscribeMessageUid)}Message from '${path}/messages/${pascalCase(subscribeMessageUid)}'`
  }

  return `
${publishMessageImport}
${subscribeMessageImport}

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '${path}/NatsTypescriptTemplateError';
import { Hooks } from '${path}/hooks';

  `
}
