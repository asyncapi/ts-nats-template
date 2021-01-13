
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';

/**
 * Component which ensures the hooks are called after receiving data.
 * 
 * @param {*} message which is being received
 * @param {*} defaultContentType 
 */
export function OnReceivingData(message, defaultContentType) {
  //Check if we are converting from binary
  let convertToBinary = '';
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    convertToBinary = `
    if(receivedDataHooks.length == 0){
      receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData.toString());
    }`;
  }

  //Check if we are converting from string
  let convertToString = '';
  if (isStringPayload(message.contentType(), defaultContentType)) {
    convertToString = `
    if(receivedDataHooks.length == 0){
      receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData);
    }`;
  }

  return `
  try {
    let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
    let receivedData : any = msg.data;
    for(let hook of receivedDataHooks){
      receivedData = hook(receivedData);
    }
    ${convertToBinary}
    ${convertToString}
  } catch (e) {
    const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
    throw error;
  }
  `;
}
