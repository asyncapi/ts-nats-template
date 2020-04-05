
    
  /**
  *  [object Object]
  * @param requestMessage The message to publish.
  */
  public publishToSmartylightingStreetlights10Event(requestMessage: LightMeasuredMessage): Promise<void> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventChannel.publish(requestMessage, nc);
  }

    
  /**
  *  [object Object]
  * @param requestMessage The message to publish.
  */
  public publishToSmartylightingStreetlights10EventStreetlightIdLightingMeasured(requestMessage: LightMeasuredMessage): Promise<void> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10EventStreetlightIdLightingMeasuredChannel.publish(requestMessage, nc);
  }

    
  /**
  *  [object Object]
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdTurnOn(onRequest : (err?: NatsError, msg?: TurnOnOffMessage) => TurnOnOffResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOnChannel.reply(onRequest, onReplyError, nc);
  }

    
  /**
  *  [object Object]
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdTurnOff(onRequest : (err?: NatsError, msg?: TurnOnOffMessage) => TurnOnOffResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdTurnOffChannel.reply(onRequest, onReplyError, nc);
  }

    
  /**
  *  [object Object]
  * @param onRequest Called when request recieved.
  * @param onReplyError Called when it was not possible to send the reply.
  */
  public replyToSmartylightingStreetlights10ActionStreetlightIdDim(onRequest : (err?: NatsError, msg?: DimLightMessage) => DimLightResponseMessage, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    const nc: Client = this.jsonClient!;
    return smartylightingStreetlights10ActionStreetlightIdDimChannel.reply(onRequest, onReplyError, nc);
  }

