export function includeUnsubAfterForSubscription(message) {
  if (hasNatsBindings(message) && message.bindings().nats().unsubAfter()) {
    return `subscribeOptions.max = '${message.bindings().nats().unsubAfter()}';`;
  }
  return '';
}
export function includeQueueForSubscription(message) {
  if (hasNatsBindings(message) && message.bindings().nats().queue()) {
    return `subscribeOptions.queue = '${message.bindings().nats().queue()}';`;
  }
  return '';
}

/**
 * Does an object have bindings
 */
export function hasNatsBindings(obj) {
  return obj.bindings && obj.bindings.nats;
}
  
/**
   * is the channel a publish and subscribe type if nothing is specified default to being pubsub type 
   */
export function isPubsub(channel) {
  const tempChannel = channel._json;
  if (
    !tempChannel.bindings || 
      !tempChannel.bindings.nats ||
      !tempChannel.bindings.nats.is || 
      tempChannel.bindings.nats.is === 'pubsub') {
    return true;
  }
  return false;
}
  
/**
 * is the channel a request and reply
 */
export function isRequestReply(channel) {
  const tempChannel = channel._json;
  if (
    tempChannel.bindings &&
      tempChannel.bindings.nats &&
      tempChannel.bindings.nats.is === 'requestReply'
  ) {
    return true;
  }
  return false;
}
  
/**
 * Is the request reply a requester
 */
export function isRequester(channel) {
  const tempChannel = channel._json;
  if (
    isRequestReply(channel) &&
      tempChannel.bindings.nats.requestReply &&
      tempChannel.bindings.nats.requestReply.is === 'requester'
  ) {
    return true;
  }
  return false;
}
  
/**
 * Is the request reply a replier
 */
export function isReplier(channel) {
  const tempChannel = channel._json;
  if (
    isRequestReply(channel) &&
      tempChannel.bindings.nats.requestReply &&
      tempChannel.bindings.nats.requestReply.is === 'replier'
  ) {
    return true;
  }
  return false;
}