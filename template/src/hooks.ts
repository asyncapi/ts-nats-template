export enum AvailableHooks {
	RecievedData = 'RecievedData',
	BeforeSendingData = 'BeforeSendingData'
}
export type RecievedDataHook = (receivedData: any) => string;
export type BeforeSendingDataHook = (messageToSend: any) => string;
export class Hooks {
	private static instance: Hooks;
	
	private hooks: {
		BeforeSendingData: BeforeSendingDataHook[];
		RecievedData: RecievedDataHook[];
	};
	private constructor() { 
		this.hooks = {
			BeforeSendingData: [],
			RecievedData: []
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
	public async registerRecievedData(hook: RecievedDataHook) {
		this.hooks[AvailableHooks.RecievedData]
			? this.hooks[AvailableHooks.RecievedData].push(hook)
			: [hook];
	}
	
	
	public getRecievedDataHook(): RecievedDataHook[] {
		return this.hooks[AvailableHooks.RecievedData];
	}
	
	public getBeforeSendingDataHook(): BeforeSendingDataHook[] {
		return this.hooks[AvailableHooks.BeforeSendingData];
	}
}