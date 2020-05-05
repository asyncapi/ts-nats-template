const HOOKS_DIRNAME = './hooks';
import * as fs from 'fs';
import * as path from 'path';
import * as walkSync from 'klaw-sync';
export enum AvailableHooks {
	RecievedData = 'RecievedData',
	BeforeSendingData = 'BeforeSendingData'
}
export type RecievedDataHook = (receivedData: any) => string;
export type BeforeSendingDataHook = (messageToSend: any) => string;
export var hooks: {
	BeforeSendingData: BeforeSendingDataHook[];
	RecievedData: RecievedDataHook[];
};

/**
 * Loads the custom hooks.
 */
try {
	const hooksPath = path.resolve(HOOKS_DIRNAME);
	if (fs.existsSync(hooksPath)) {
		const files = walkSync(hooksPath, { nodir: true });
		files.forEach((file: any) => {
			require(file.path)((when: AvailableHooks, hook: any) => {
				hooks[when].push(hook);
			});
		});
	}
} catch (e) {
	e.message = `There was a problem registering the hooks: ${e.message}`;
	throw e;
}

/**
 * Register a hook for BeforeSendingData
 * @param hook
 */
export async function registerBeforeSendingData(hook: BeforeSendingDataHook) {
	hooks[AvailableHooks.BeforeSendingData]
		? hooks[AvailableHooks.BeforeSendingData].push(hook)
		: [hook];
}

/**
 * Register a hook for BeforeSendingData
 * @param hook
 */
export async function registerRecievedData(hook: RecievedDataHook) {
	hooks[AvailableHooks.RecievedData]
		? hooks[AvailableHooks.RecievedData].push(hook)
		: [hook];
}


export function getRecievedDataHook(): RecievedDataHook[] {
	if (!Array.isArray(hooks[AvailableHooks.RecievedData])) return [];
	// Return valid hooks
	return hooks[AvailableHooks.RecievedData];
}

export function getBeforeSendingDataHook(): BeforeSendingDataHook[] {
	if (!Array.isArray(hooks[AvailableHooks.BeforeSendingData])) return [];
	// Return valid hooks
	return hooks[AvailableHooks.BeforeSendingData];
}
