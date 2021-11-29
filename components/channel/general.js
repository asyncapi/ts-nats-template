
import { messageHasNullPayload, getSchemaFileName } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message, Channel} from '@asyncapi/parser';

/**
 * Component which includes all the general imports used for the channel
 * 
 * @param {Channel} channel used to check if message should be imported
 * @param {Message} publishMessage to import 
 * @param {Message} subscribeMessage to import 
 * @param {string} path to where schemas are located
 */
export function General(channel, publishMessage, subscribeMessage, path) {
  let publishMessageImport = '';
  const publishHasNullPayload = messageHasNullPayload(publishMessage.payload());
  if (channel.hasPublish() && !publishHasNullPayload) {
    const publishMessageUid = getSchemaFileName(publishMessage.payload().uid());
    publishMessageImport = `import {${publishMessageUid}} from '${path}/models/${publishMessageUid}';`;
  }
  let subscribeMessageImport = '';
  const subscribeHasNullPayload = messageHasNullPayload(publishMessage.payload());
  if (channel.hasSubscribe() && !subscribeHasNullPayload) {
    const subscribeMessageUid = getSchemaFileName(subscribeMessage.payload().uid());
    subscribeMessageImport = `import {${subscribeMessageUid}} from '${path}/models/${subscribeMessageUid}';`;
  }
  return `
${publishMessageImport}
${subscribeMessageImport}

import * as Nats from 'nats';
import {ErrorCode, NatsTypescriptTemplateError} from '${path}/NatsTypescriptTemplateError';
  `;
}
