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
const NatsTypescriptTemplateError_1 = require("../NatsTypescriptTemplateError");
const hooks_1 = require("../hooks");
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to setup subscription on the `streetlight/{streetlight_id}/command/turnon` channel
 *
 * @param onDataCallback to call when messages are received
 * @param client to subscribe with
 * @param streetlight_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
function subscribe(onDataCallback, client, streetlight_id, options) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let subscribeOptions = Object.assign({}, options);
        try {
            let subscription = yield client.subscribe(`streetlight.${streetlight_id}.command.turnon`, (err, msg) => {
                if (err) {
                    onDataCallback(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, err));
                }
                else {
                    const unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
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
                            undefined;
                        }
                        catch (e) {
                            const error = NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.HOOK_ERROR, e);
                            throw error;
                        }
                    }
                    catch (e) {
                        onDataCallback(e);
                        return;
                    }
                    onDataCallback(undefined, receivedData, streetlightIdParam);
                }
            }, subscribeOptions);
            resolve(subscription);
        }
        catch (e) {
            reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
    }));
}
exports.subscribe = subscribe;
//# sourceMappingURL=StreetlightStreetlightIdCommandTurnon.js.map