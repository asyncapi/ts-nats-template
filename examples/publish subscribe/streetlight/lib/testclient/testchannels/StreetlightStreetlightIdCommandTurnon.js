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
exports.publish = void 0;
const NatsTypescriptTemplateError_1 = require("../../NatsTypescriptTemplateError");
/**
 * Module which wraps functionality for the `streetlight/{streetlight_id}/command/turnon` channel
 * @module streetlightStreetlightIdCommandTurnon
 */
/**
 * Internal functionality to publish message to channel
 * streetlight/{streetlight_id}/command/turnon
 *
 * @param message to publish
 * @param nc to publish with
 * @param codec used to convert messages
 * @param streetlight_id parameter to use in topic
 * @param options to publish with
 */
function publish(message, nc, codec, streetlight_id, options) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let dataToSend = message.marshal();
            dataToSend = codec.encode(dataToSend);
            nc.publish(`streetlight.${streetlight_id}.command.turnon`, dataToSend, options);
            resolve();
        }
        catch (e) {
            reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        }
    }));
}
exports.publish = publish;
;
//# sourceMappingURL=StreetlightStreetlightIdCommandTurnon.js.map