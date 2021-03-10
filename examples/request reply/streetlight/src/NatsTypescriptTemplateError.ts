import * as util from 'util';
export enum ErrorCode {
  NOT_CONNECTED = 'NOT_CONNECTED',
    INTERNAL_NATS_TS_ERROR = 'INTERNAL_NATS_TS_ERROR',
    HOOK_ERROR = 'HOOK_ERROR'
}
/** @internal **/
export class Messages {
  static messages = new Messages();
  messages: {
    [key: string]: string
  } = {};
  private constructor() {
    this.messages[ErrorCode.NOT_CONNECTED] = 'The client is not connected';
    this.messages[ErrorCode.INTERNAL_NATS_TS_ERROR] = 'An error occured while trying to use the Nats Typescript library';
    this.messages[ErrorCode.HOOK_ERROR] = 'An error occured while trying to call one of the hooks.';
  }
  static getMessage(s: string): string {
    return Messages.messages.getMessage(s);
  }
  getMessage(s: string): string {
    let v = this.messages[s];
    if (!v) {
      v = s;
    }
    return v;
  }
}
export class NatsTypescriptTemplateError implements Error {
  name: string;
  message: string;
  code: string;
  chainedError ? : Error;
  /**
   * @param {String} message
   * @param {String} code
   * @param {Error} [chainedError]
   * @constructor
   *
   * @api private
   * @internal
   */
  constructor(message: string, code: string, chainedError ? : Error) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'NatsTypescriptTemplateError';
    this.message = message;
    this.code = code;
    this.chainedError = chainedError;
    util.inherits(NatsTypescriptTemplateError, Error);
  }
  /**
   * @param code
   * @param chainedError
   * @api private
   * @internal
   */
  static errorForCode(code: string, chainedError ? : Error): NatsTypescriptTemplateError {
    let m = Messages.getMessage(code);
    return new NatsTypescriptTemplateError(m, code, chainedError);
  }
}