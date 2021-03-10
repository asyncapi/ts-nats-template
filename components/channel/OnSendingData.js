
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';
// eslint-disable-next-line no-unused-vars
import { Message } from '@asyncapi/parser';

/**
 * Component which ensures the hooks are called before transmitting data.
 * 
 * @param {Message} message which is being transmitted.
 * @param {string} defaultContentType 
 */
export function OnSendingData(message, defaultContentType) {
  const messageName = pascalCase(message.uid());

  //Check if we are converting to binary
  let convertToBinary = '';
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    convertToBinary = `
    if(beforeSendingHooks.length == 0){
      dataToSend = Buffer.from(${messageName}Message.Convert.${messageName}ToJson(dataToSend));
    }
    `;
  }
  
  //Check if we are converting to string
  let convertToString = '';
  if (isStringPayload(message.contentType(), defaultContentType)) {
    convertToString = `
    if(beforeSendingHooks.length == 0 ){
      dataToSend = ${messageName}Message.Convert.${messageName}ToJson(dataToSend);
    }
    `;
  }
  
  return `
  try {
    let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
    for(let hook of beforeSendingHooks){
      dataToSend = hook(dataToSend);
    }
    ${convertToBinary}
    ${convertToString}
  } catch(e) {
    const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
    throw error;
  }
  `;
}
