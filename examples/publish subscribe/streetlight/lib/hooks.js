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
var AvailableHooks;
(function (AvailableHooks) {
    AvailableHooks["ReceivedData"] = "ReceivedData";
    AvailableHooks["BeforeSendingData"] = "BeforeSendingData";
})(AvailableHooks = exports.AvailableHooks || (exports.AvailableHooks = {}));
class Hooks {
    constructor() {
        this.hooks = {
            BeforeSendingData: [],
            ReceivedData: []
        };
    }
    static getInstance() {
        if (!Hooks.instance) {
            Hooks.instance = new Hooks();
        }
        return Hooks.instance;
    }
    /**
     * Register a hook for BeforeSendingData
     * @param hook
     */
    registerBeforeSendingData(hook) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hooks[AvailableHooks.BeforeSendingData] ?
                this.hooks[AvailableHooks.BeforeSendingData].push(hook) :
                [hook];
        });
    }
    /**
     * Register a hook for BeforeSendingData
     * @param hook
     */
    registerReceivedData(hook) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hooks[AvailableHooks.ReceivedData] ?
                this.hooks[AvailableHooks.ReceivedData].push(hook) :
                [hook];
        });
    }
    /**
     * Returns all registered hooks for ReceivedData
     *
     * @returns {ReceivedDataHook[]} registered hooks
     */
    getReceivedDataHook() {
        return this.hooks[AvailableHooks.ReceivedData];
    }
    /**
     * Returns all registered hooks for BeforeSendingData
     *
     * @returns {BeforeSendingDataHook[]} registered hooks
     */
    getBeforeSendingDataHook() {
        return this.hooks[AvailableHooks.BeforeSendingData];
    }
}
exports.Hooks = Hooks;
//# sourceMappingURL=hooks.js.map