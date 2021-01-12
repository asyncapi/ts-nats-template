
import { isBinaryPayload, pascalCase, isStringPayload } from '../../utils/index';
export function OnReceivingData(message, defaultContentType) {
  let convertToBinary = '';
  if (isBinaryPayload(message.contentType(), defaultContentType)) {
    convertToBinary = `
		if(receivedDataHooks.length == 0){
			receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData.toString());
		}
		`;
  }

  let convertToString = '';
  if (isStringPayload(message.contentType(), defaultContentType)) {
    convertToString = `
	if(receivedDataHooks.length == 0){
		receivedData = ${pascalCase(message.uid())}Message.Convert.to${pascalCase(message.uid())}(receivedData);
	}
		`;
  }

  return `
try {
	let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
	var receivedData : any = msg.data;
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
