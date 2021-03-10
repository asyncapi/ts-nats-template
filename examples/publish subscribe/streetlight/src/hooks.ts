export enum AvailableHooks {
  ReceivedData = 'ReceivedData',
    BeforeSendingData = 'BeforeSendingData'
}
export type ReceivedDataHook = (ReceivedData: any) => string;
export type BeforeSendingDataHook = (messageToSend: any) => string;
export class Hooks {
  private static instance: Hooks;
  private hooks: {
    BeforeSendingData: BeforeSendingDataHook[];
    ReceivedData: ReceivedDataHook[];
  };
  private constructor() {
    this.hooks = {
      BeforeSendingData: [],
      ReceivedData: []
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
    this.hooks[AvailableHooks.BeforeSendingData] ?
      this.hooks[AvailableHooks.BeforeSendingData].push(hook) :
      [hook];
  }
  /**
   * Register a hook for BeforeSendingData
   * @param hook
   */
  public async registerReceivedData(hook: ReceivedDataHook) {
    this.hooks[AvailableHooks.ReceivedData] ?
      this.hooks[AvailableHooks.ReceivedData].push(hook) :
      [hook];
  }
  /**
   * Returns all registered hooks for ReceivedData
   * 
   * @returns {ReceivedDataHook[]} registered hooks
   */
  public getReceivedDataHook(): ReceivedDataHook[] {
    return this.hooks[AvailableHooks.ReceivedData];
  }
  /**
   * Returns all registered hooks for BeforeSendingData
   * 
   * @returns {BeforeSendingDataHook[]} registered hooks
   */
  public getBeforeSendingDataHook(): BeforeSendingDataHook[] {
    return this.hooks[AvailableHooks.BeforeSendingData];
  }
}