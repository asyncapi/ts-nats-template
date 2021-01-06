
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';
export function OnSendingData(message, defaultContentType) {
  const messageName = pascalCase(message.uid());
  let convertToBinary = '';
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    convertToBinary = `
      if(beforeSendingHooks.length == 0){
      dataToSend = Buffer.from(${messageName}}Message.Convert.${messageName}ToJson(dataToSend));
      }
		  `;
  }
  
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
		var dataToSend : any = message;
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
