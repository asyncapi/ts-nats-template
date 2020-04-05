
    
  /**
  *  [object Object]
  * @param onDataCallback Called when message recieved.
  */
  public subscribeToSmartylightingStreetlights10EventStreetlightIdLightingMeasured(onDataCallback : (err?: NatsError, msg?: LightMeasuredMessage) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel.subscribe(onDataCallback, nc);
  }

    
  /**
  *  [object Object]
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOn(requestMessage: TurnOnOffMessage): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOnChannel.request(requestMessage, nc);
  }

    
  /**
  *  [object Object]
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdTurnOff(requestMessage: TurnOnOffMessage): Promise<TurnOnOffResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOffChannel.request(requestMessage, nc);
  }

    
  /**
  *  [object Object]
  * @param requestMessage The request message to send.
  */
  public requestSmartylightingStreetlights10ActionStreetlightIdDim(requestMessage: DimLightMessage): Promise<DimLightResponseMessage> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdDimChannel.request(requestMessage, nc);
  }

