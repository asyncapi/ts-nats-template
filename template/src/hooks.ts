const HOOKS_DIRNAME = './hooks';
import * as fs from 'fs';
import * as path from 'path';
import * as walkSync from 'klaw-sync';
export enum AvailableHooks {
	RecievedData = 'RecievedData',
	BeforeSendingData = 'BeforeSendingData'
}
export type RecievedDataHook = () => void;
export type BeforeSendingDataHook = (messageToSend: any) => void;
export var hooks: {
	BeforeSendingData: [BeforeSendingDataHook];
	RecievedData: [RecievedDataHook];
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
				hooks[when] = hooks[when] || [];
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

/**
 * Get all the hooks registered at a given hook point/name.
 * @param hook to find hooks for
 * @returns all hooks
 */
export function getHooks(hook: AvailableHooks): Function[] {
	if (!Array.isArray(hooks[hook])) return [];
	// Return valid hooks
	return hooks[hook];
}
