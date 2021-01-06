
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';
export function OnReceivingData(message, defaultContentType) {
  return `
try {
	let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
	var receivedData : any = msg.data;
	for(let hook of receivedDataHooks){
		receivedData = hook(receivedData);
	}
	${
  isBinaryPayload(message.contentType(), defaultContentType) ? 
    `
		if(receivedDataHooks.length == 0){
			receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData.toString());
		}
		` : ''
}

	${
  isStringPayload(message.contentType(), defaultContentType) ?
    `
		if(receivedDataHooks.length == 0){
			receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData);
		}
		` : ''
}
} catch (e) {
	const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
	throw error;
}
	`;
}
