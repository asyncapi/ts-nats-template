"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NatsTypescriptTemplateError_1 = require("../../NatsTypescriptTemplateError");
const hooks_1 = require("../../hooks");
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
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
function reply(onRequest, onReplyError, client, streetlight_id, options) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let subscribeOptions = Object.assign({}, options);
            let subscription = yield client.subscribe(`streetlight.${streetlight_id}.event.turnon`, (err, msg) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    onRequest(err);
                }
                else {
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
                    let receivedData = msg.data;
                    try {
                        try {
                            let receivedDataHooks = hooks_1.Hooks.getInstance().getReceivedDataHook();
                            for (let hook of receivedDataHooks) {
                                receivedData = hook(receivedData);
                            }
                            if (receivedDataHooks.length == 0) {
                                receivedData = receivedData;
                            }
                        }
                        catch (e) {
                            const error = NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.HOOK_ERROR, e);
                            throw error;
                        }
                    }
                    catch (e) {
                        onReplyError(e);
                        return;
                    }
                    let message = yield onRequest(undefined, receivedData, streetlightIdParam);
                    if (msg.reply) {
                        let dataToSend = message;
                        try {
                            try {
                                let beforeSendingHooks = hooks_1.Hooks.getInstance().getBeforeSendingDataHook();
                                for (let hook of beforeSendingHooks) {
                                    dataToSend = hook(dataToSend);
                                }
                            }
                            catch (e) {
                                const error = NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.HOOK_ERROR, e);
                                throw error;
                            }
                        }
                        catch (e) {
                            onReplyError(e);
                            return;
                        }
                        yield client.publish(msg.reply, dataToSend);
                    }
                    else {
                        let error = new NatsTypescriptTemplateError_1.NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
                        onReplyError(error);
                        return;
                    }
                }
            }), subscribeOptions);
            resolve(subscription);
        }
        catch (e) {
            reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
    }));
}
exports.reply = reply;
//# sourceMappingURL=StreetlightStreetlightIdEventTurnon.js.map