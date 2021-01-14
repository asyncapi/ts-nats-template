

/**
 * Wrapper to include subscriptions option code if specified in the spec.
 * 
 * @param {*} message to check for queue bindings on 
 */
export function includeUnsubAfterForSubscription(message) {
  if (message.hasBinding('nats') && message.bindings().nats.unsubAfter) {
    return `subscribeOptions.max = '${message.binding('nats').unsubAfter}';`;
  }
  return '';
}

/**
 * Wrapper to include subscriptions queue option if specified in the spec.
 * 
 * @param {*} message to check for queue bindings on 
 */
export function includeQueueForSubscription(message) {
  if (message.hasBinding('nats') && message.binding('nats').queue) {
    return `subscribeOptions.queue = '${message.binding('nats').queue}';`;
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
