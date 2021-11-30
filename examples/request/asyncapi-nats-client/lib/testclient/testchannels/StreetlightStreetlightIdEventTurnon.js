"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = void 0;
const AnonymousSchema_3_1 = require("../../models/AnonymousSchema_3");
const NatsTypescriptTemplateError_1 = require("../../NatsTypescriptTemplateError");
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to setup reply to the `streetlight/{streetlight_id}/event/turnon` channel
 *
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
function reply(onRequest, onReplyError, nc, codec, streetlight_id, options) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let subscribeOptions = Object.assign({}, options);
            let subscription = nc.subscribe(`streetlight.${streetlight_id}.event.turnon`, subscribeOptions);
            (() => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                try {
                    for (var subscription_1 = __asyncValues(subscription), subscription_1_1; subscription_1_1 = yield subscription_1.next(), !subscription_1_1.done;) {
                        const msg = subscription_1_1.value;
                        const unmodifiedChannel = `streetlight.{streetlight_id}.event.turnon`;
                        let channel = msg.subject;
                        const streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");
                        const splits = [
                            streetlightIdSplit[0],
                            streetlightIdSplit[1]
                        ];
                        channel = channel.substring(splits[0].length);
                        const streetlightIdEnd = channel.indexOf(splits[1]);
                        const streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);
                        let receivedData = codec.decode(msg.data);
                        let replyMessage = yield onRequest(undefined, AnonymousSchema_3_1.AnonymousSchema_3.unmarshal(receivedData), streetlightIdParam);
                        if (msg.reply) {
                            let dataToSend = replyMessage.marshal();
                            dataToSend = codec.encode(dataToSend);
                            msg.respond(dataToSend);
                        }
                        else {
                            let error = new NatsTypescriptTemplateError_1.NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
                            onReplyError(error);
                            return;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (subscription_1_1 && !subscription_1_1.done && (_a = subscription_1.return)) yield _a.call(subscription_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }))();
            resolve(subscription);
        }
        catch (e) {
            reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
    }));
}
exports.reply = reply;
//# sourceMappingURL=StreetlightStreetlightIdEventTurnon.js.map