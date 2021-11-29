"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsTypescriptTemplateError = exports.Messages = exports.ErrorCode = void 0;
const util = __importStar(require("util"));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["NOT_CONNECTED"] = "NOT_CONNECTED";
    ErrorCode["INTERNAL_NATS_TS_ERROR"] = "INTERNAL_NATS_TS_ERROR";
    ErrorCode["HOOK_ERROR"] = "HOOK_ERROR";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
/** @internal **/
class Messages {
    constructor() {
        this.messages = {};
        this.messages[ErrorCode.NOT_CONNECTED] = 'The client is not connected';
        this.messages[ErrorCode.INTERNAL_NATS_TS_ERROR] = 'An error occured while trying to use the Nats Typescript library';
        this.messages[ErrorCode.HOOK_ERROR] = 'An error occured while trying to call one of the hooks.';
    }
    static getMessage(s) {
        return Messages.messages.getMessage(s);
    }
    getMessage(s) {
        let v = this.messages[s];
        if (!v) {
            v = s;
        }
        return v;
    }
}
exports.Messages = Messages;
Messages.messages = new Messages();
class NatsTypescriptTemplateError {
    /**
     * @param {String} message
     * @param {String} code
     * @param {Error} [chainedError]
     * @constructor
     *
     * @api private
     * @internal
     */
    constructor(message, code, chainedError) {
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
    static errorForCode(code, chainedError) {
        let m = Messages.getMessage(code);
        return new NatsTypescriptTemplateError(m, code, chainedError);
    }
}
exports.NatsTypescriptTemplateError = NatsTypescriptTemplateError;
//# sourceMappingURL=NatsTypescriptTemplateError.js.map