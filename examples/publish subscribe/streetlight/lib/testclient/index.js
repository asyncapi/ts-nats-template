"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_nkeys_1 = require("ts-nkeys");
const NatsTypescriptTemplateError_1 = require("..//NatsTypescriptTemplateError");
const ts_nats_1 = require("ts-nats");
const streetlightStreetlightIdCommandTurnonChannel = __importStar(require("./testchannels/StreetlightStreetlightIdCommandTurnon"));
exports.streetlightStreetlightIdCommandTurnonChannel = streetlightStreetlightIdCommandTurnonChannel;
const streetlightStreetlightIdEventTurnonChannel = __importStar(require("./testchannels/StreetlightStreetlightIdEventTurnon"));
exports.streetlightStreetlightIdEventTurnonChannel = streetlightStreetlightIdEventTurnonChannel;
const events = __importStar(require("events"));
var AvailableEvents;
(function (AvailableEvents) {
    AvailableEvents["permissionError"] = "permissionError";
    AvailableEvents["close"] = "close";
    AvailableEvents["connect"] = "connect";
    AvailableEvents["connecting"] = "connecting";
    AvailableEvents["disconnect"] = "disconnect";
    AvailableEvents["error"] = "error";
    AvailableEvents["pingcount"] = "pingcount";
    AvailableEvents["pingtimer"] = "pingtimer";
    AvailableEvents["reconnect"] = "reconnect";
    AvailableEvents["reconnecting"] = "reconnecting";
    AvailableEvents["serversChanged"] = "serversChanged";
    AvailableEvents["subscribe"] = "subscribe";
    AvailableEvents["unsubscribe"] = "unsubscribe";
    AvailableEvents["yield"] = "yield";
})(AvailableEvents = exports.AvailableEvents || (exports.AvailableEvents = {}));
/**
 * @class NatsAsyncApiTestClient
 *
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
class NatsAsyncApiTestClient extends events.EventEmitter {
    constructor() {
        super();
    }
    /**
     * Try to connect to the NATS server with the different payloads.
     * @param options to use, payload is omitted if sat in the AsyncAPI document.
     */
    connect(options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.options = options;
            try {
                if (!this.jsonClient || this.jsonClient.isClosed()) {
                    this.options.payload = ts_nats_1.Payload.JSON;
                    this.jsonClient = yield ts_nats_1.connect(this.options);
                    this.chainEvents(this.jsonClient);
                }
                resolve();
            }
            catch (e) {
                reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
            }
        }));
    }
    /**
     * Disconnect all clients from the server
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed()) {
                yield this.jsonClient.drain();
            }
        });
    }
    /**
     * Returns whether or not any of the clients are closed
     */
    isClosed() {
        if (!this.jsonClient || this.jsonClient.isClosed()) {
            return true;
        }
        return false;
    }
    chainEvents(ns) {
        ns.on('permissionError', (e) => {
            this.emit(AvailableEvents.permissionError, NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        });
        ns.on('close', (e) => {
            this.emit(AvailableEvents.close, NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        });
        ns.on('connect', (connection, serverURL, info) => {
            this.emit(AvailableEvents.connect, connection, serverURL, info);
        });
        ns.on('connecting', (serverURL) => {
            this.emit(AvailableEvents.connecting, serverURL);
        });
        ns.on('disconnect', (serverURL) => {
            this.emit(AvailableEvents.disconnect, serverURL);
        });
        ns.on('error', (e) => {
            this.emit(AvailableEvents.error, NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
        });
        ns.on('pingcount', () => {
            this.emit(AvailableEvents.pingcount);
        });
        ns.on('pingtimer', () => {
            this.emit(AvailableEvents.pingtimer);
        });
        ns.on('reconnect', (connection, serverURL, info) => {
            this.emit(AvailableEvents.reconnect, connection, serverURL, info);
        });
        ns.on('reconnecting', (serverURL) => {
            this.emit(AvailableEvents.reconnecting, serverURL);
        });
        ns.on('serversChanged', (e) => {
            this.emit(AvailableEvents.serversChanged, e);
        });
        ns.on('subscribe', (e) => {
            this.emit(AvailableEvents.subscribe, e);
        });
        ns.on('unsubscribe', (e) => {
            this.emit(AvailableEvents.unsubscribe, e);
        });
        ns.on('yield', () => {
            this.emit(AvailableEvents.yield);
        });
    }
    /**
     * Try to connect to the NATS server with user credentials
     *
     * @param userCreds to use
     * @param options to connect with
     */
    connectWithUserCreds(userCreds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ userCreds: userCreds }, options));
        });
    }
    /**
     * Try to connect to the NATS server with user and password
     *
     * @param user username to use
     * @param pass password to use
     * @param options to connect with
     */
    connectWithUserPass(user, pass, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ user: user, pass: pass }, options));
        });
    }
    /**
     * Try to connect to the NATS server which has no authentication
     
     * @param host to connect to
     * @param options to connect with
     */
    connectToHost(host, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ servers: [host] }, options));
        });
    }
    /**
     * Try to connect to the NATS server with NKey authentication
     *
     * @param publicNkey User
     * @param seed private key
     * @param options to connect with
     */
    connectWithNkey(publicNkey, seed, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ nkey: publicNkey, nonceSigner: (nonce) => {
                    const sk = ts_nkeys_1.fromSeed(Buffer.from(seed));
                    return sk.sign(Buffer.from(nonce));
                } }, options));
        });
    }
    /**
     * Publish to the `streetlight/{streetlight_id}/command/turnon` channel
     *
     * Channel for the turn on command which should turn on the streetlight
     *
     * @param message to publish
     * @param streetlight_id parameter to use in topic
     */
    publishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id) {
        const nc = this.jsonClient;
        if (nc) {
            return streetlightStreetlightIdCommandTurnonChannel.publish(message, nc, streetlight_id);
        }
        else {
            return Promise.reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.NOT_CONNECTED));
        }
    }
    /**
     * Subscribe to the `streetlight/{streetlight_id}/event/turnon`
     *
     * Channel for when the streetlight is turned on
     *
     * @param onDataCallback to call when messages are received
     * @param streetlight_id parameter to use in topic
     * @param flush ensure client is force flushed after subscribing
     * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
     */
    subscribeToStreetlightStreetlightIdEventTurnon(onDataCallback, streetlight_id, flush, options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const nc = this.jsonClient;
            if (nc) {
                try {
                    const sub = yield streetlightStreetlightIdEventTurnonChannel.subscribe(onDataCallback, nc, streetlight_id, options);
                    if (flush) {
                        this.jsonClient.flush(() => {
                            resolve(sub);
                        });
                    }
                    else {
                        resolve(sub);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.NOT_CONNECTED));
            }
        }));
    }
}
exports.NatsAsyncApiTestClient = NatsAsyncApiTestClient;
//# sourceMappingURL=index.js.map