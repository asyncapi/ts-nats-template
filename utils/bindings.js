
/**
 * Wrapper to include subscriptions option code if specified in the spec.
 * 
 * @param {*} operation to check for queue bindings on 
 */
export function includeUnsubAfterForSubscription(operation) {
  if (operation !== undefined && operation.hasBinding('nats') && operation.binding('nats').unsubAfter) {
    return `subscribeOptions.max = '${operation.binding('nats').unsubAfter}';`;
  }
  return '';
}

/**
 * Wrapper to include subscriptions queue option if specified in the spec.
 * 
 * @param {*} obj to check for queue bindings on 
 */
export function includeQueueForSubscription(operation) {
  if (operation !== undefined && operation.hasBinding('nats') && operation.binding('nats').queue) {
    return `subscribeOptions.queue = '${operation.binding('nats').queue}';`;
  }
  return '';
}

/**
 * Is the channel a publish and subscribe. This is the default type if none is defined.
 */
export function isPubsub(channel) {
  if (!channel.hasBinding('nats') ||
      !channel.binding('nats').is || 
      channel.binding('nats').is === 'pubsub') {
    return true;
  }
  return false;
}
  
/**
 * Is the channel a request and reply.
 */
export function isRequestReply(channel) {
  if (channel.hasBinding('nats') &&
      channel.binding('nats').is && 
      channel.binding('nats').is === 'requestReply') {
    return true;
  }
  return false;
}
  
/**
 * Is the request reply a requester
 */
export function isRequester(channel) {
  if (isRequestReply(channel) &&
      channel.binding('nats').requestReply &&
      channel.binding('nats').requestReply.is === 'requester') {
    return true;
  }
  return false;
}
  
/**
 * Is the request reply a replier
 */
export function isReplier(channel) {
  if (isRequestReply(channel) &&
      channel.binding('nats').requestReply &&
      channel.binding('nats').requestReply.is === 'replier') {
    return true;
  }
  return false;
}
