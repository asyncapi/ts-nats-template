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
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const GeneralReply_1 = require("../models/GeneralReply");
const NatsTypescriptTemplateError_1 = require("../NatsTypescriptTemplateError");
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/event/turnon` channel
 * @module streetlightStreetlightIdEventTurnon
 */
/**
 * Internal functionality to send request to the `streetlight/{streetlight_id}/event/turnon` channel
 *
 * @param requestMessage to send
 * @param nc to send request with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to use for the request
 */
function request(requestMessage, nc, codec, streetlight_id, options) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let dataToSend = codec.encode(requestMessage.marshal());
            const msg = yield nc.request(`streetlight.${streetlight_id}.event.turnon`, dataToSend, options);
            let receivedData = codec.decode(msg.data);
            resolve(GeneralReply_1.GeneralReply.unmarshal(receivedData));
        }
        catch (e) {
            reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
            return;
        }
    }));
}
exports.request = request;
//# sourceMappingURL=StreetlightStreetlightIdEventTurnon.js.map