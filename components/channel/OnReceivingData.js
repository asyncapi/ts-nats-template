
import { isBinaryPayload, isStringPayload, isJsonPayload} from '../../utils/index';

/**
 * Component which ensures the hooks are called after receiving data.
 * 
 * @param {*} message which is being received
 * @param {*} defaultContentType 
 */
export function OnReceivingData(message, defaultContentType) {
  //Check if we are converting from binary
  let convertFromBinary;
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    convertFromBinary = `
    if(receivedDataHooks.length == 0){
      receivedData = JSON.parse(receivedData.toString());
    }`;
  }

  //Check if we are converting from string
  let convertFromString;
  if (isStringPayload(message.contentType(), defaultContentType)) {
    convertFromString = `
    if(receivedDataHooks.length == 0){
      receivedData = JSON.parse(receivedData);
    }`;
  }

  //Check if we are converting from JSON
  let convertFromJson;
  if (isJsonPayload(message.contentType(), defaultContentType)) {
    convertFromJson = `
    if(receivedDataHooks.length == 0){
      receivedData = receivedData;
    }`;
  }

  return `
  try {
    let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
    for(let hook of receivedDataHooks){
      receivedData = hook(receivedData);
    }
    ${convertFromBinary || convertFromString || convertFromJson}
  } catch (e) {
    const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
    throw error;
  }
  `;
}
