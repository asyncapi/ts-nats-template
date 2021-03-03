
export function Events() {
  return `
on(event: AvailableEvents.permissionError, listener: (error: NatsTypescriptTemplateError) => void): this;
on(event: AvailableEvents.close, listener: (error: NatsTypescriptTemplateError) => void): this;
on(event: AvailableEvents.connect, listener: (connection: Client, serverURL: string, info: ServerInfo) => void): this;
on(event: AvailableEvents.connecting, listener: (error: NatsTypescriptTemplateError) => void): this;
on(event: AvailableEvents.disconnect, listener: (serverURL: string) => void): this;
on(event: AvailableEvents.error, listener: (error: NatsTypescriptTemplateError) => void): this;
on(event: AvailableEvents.pingcount, listener: () => void): this;
on(event: AvailableEvents.pingtimer, listener: () => void): this;
on(event: AvailableEvents.reconnect, listener: (connection: Client, serverURL: string, info: ServerInfo)=> void): this;
on(event: AvailableEvents.reconnecting, listener: (serverURL: string) => void): this;
on(event: AvailableEvents.serversChanged, listener: (e: ServersChangedEvent) => void): this;
on(event: AvailableEvents.subscribe, listener: (e: SubEvent) => void): this;
on(event: AvailableEvents.unsubscribe, listener: (e: SubEvent) => void): this;
on(event: AvailableEvents.yield, listener:  () => void): this;
    `;
}
