// eslint-disable-next-line no-unused-vars
import { Operation, Channel } from '@asyncapi/parser';

/**
 * Wrapper to include subscriptions queue option if specified in the spec.
 * 
 * @param {Operation} obj to check for queue bindings on 
 */
export function includeQueueForSubscription(operation) {
  if (operation !== undefined && operation.hasBinding('nats') && operation.binding('nats').queue) {
    return `subscribeOptions.queue = '${operation.binding('nats').queue}';`;
  }
  return '';
}
