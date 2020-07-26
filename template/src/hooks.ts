export enum AvailableHooks {
	receivedData = 'receivedData',
	BeforeSendingData = 'BeforeSendingData'
}
export type receivedDataHook = (receivedData: any) => string;
export type BeforeSendingDataHook = (messageToSend: any) => string;
export class Hooks {
	private static instance: Hooks;
	
	private hooks: {
		BeforeSendingData: BeforeSendingDataHook[];
		receivedData: receivedDataHook[];
	};
	private constructor() { 
		this.hooks = {
			BeforeSendingData: [],
			receivedData: []
		}
	}
    public static getInstance(): Hooks {
        if (!Hooks.instance) {
            Hooks.instance = new Hooks();
        }
        return Hooks.instance;
	}

	
	
	/**
	 * Register a hook for BeforeSendingData
	 * @param hook
	 */
	public async registerBeforeSendingData(hook: BeforeSendingDataHook) {
		this.hooks[AvailableHooks.BeforeSendingData]
			? this.hooks[AvailableHooks.BeforeSendingData].push(hook)
			: [hook];
	}
	
	/**
	 * Register a hook for BeforeSendingData
	 * @param hook
	 */
	public async registerreceivedData(hook: receivedDataHook) {
		this.hooks[AvailableHooks.receivedData]
			? this.hooks[AvailableHooks.receivedData].push(hook)
			: [hook];
	}
	
	
	public getreceivedDataHook(): receivedDataHook[] {
		return this.hooks[AvailableHooks.receivedData];
	}
	
	public getBeforeSendingDataHook(): BeforeSendingDataHook[] {
		return this.hooks[AvailableHooks.BeforeSendingData];
	}
}