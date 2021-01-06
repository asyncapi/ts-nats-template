
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';
export function OnSendingData(message, defaultContentType) {
  const messageName = pascalCase(message.uid());
  return `
	try {
		let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
		var dataToSend : any = message;
		for(let hook of beforeSendingHooks){
		  dataToSend = hook(dataToSend);
		}

		${
  isBinaryPayload(message.contentType(), defaultContentType) ? 
    `
			if(beforeSendingHooks.length == 0){
			  dataToSend = Buffer.from(${messageName}}Message.Convert.${messageName}ToJson(dataToSend));
			}
			` : ''
}

		${
  isStringPayload(message.contentType(), defaultContentType) ?
    `
			if(beforeSendingHooks.length == 0 ){
			  dataToSend = ${messageName}Message.Convert.${messageName}ToJson(dataToSend);
			}
			` : ''
}
	  } catch(e) {
		const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
		throw error;
	  }
	`;
}
