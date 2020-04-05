export function realizeChannelName(channelName: string, parameters: any) {
	let returnString = channelName;
	returnString = returnString.replace('/', '.');
	for (let parameterName in parameters) {
		returnString = returnString.replace(
			`{${parameterName}}`,
			parameters[parameterName]
		);
	}
	return returnString;
}
