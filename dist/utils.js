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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryOptions = void 0;
/**
 * Retry is used for OpenVidu Enterprise High Availability for reconnecting purposes
 * to allow fault tolerance
 * This class is used to retry the connection to OpenVidu Server when it is not available
 */
var RetryOptions = /** @class */ (function () {
    function RetryOptions(retries, incrementSleepOnRetry, maxRetries, msRetrySleep, multiplier) {
        if (retries === void 0) { retries = 1; }
        if (incrementSleepOnRetry === void 0) { incrementSleepOnRetry = 10; }
        if (maxRetries === void 0) { maxRetries = 30; }
        if (msRetrySleep === void 0) { msRetrySleep = 150; }
        if (multiplier === void 0) { multiplier = 1.2; }
        if (retries < 0 || incrementSleepOnRetry < 0 || maxRetries < 0 || msRetrySleep < 0 || multiplier < 0) {
            throw new Error("Parameters cannot be negative.");
        }
        this._retries = retries;
        this._incrementSleepOnRetry = incrementSleepOnRetry;
        this._maxRetries = maxRetries;
        this._msRetrySleep = msRetrySleep;
        this._multiplier = multiplier;
    }
    RetryOptions.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    RetryOptions.prototype.canRetry = function () {
        return this._retries < this._maxRetries;
    };
    RetryOptions.prototype.retrySleep = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sleep(this._msRetrySleep)];
                    case 1:
                        _a.sent();
                        this._retries++;
                        if (this._retries > this._incrementSleepOnRetry) {
                            this._msRetrySleep *= this._multiplier;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(RetryOptions.prototype, "retries", {
        get: function () {
            return this._retries;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RetryOptions.prototype, "incrementSleepOnRetry", {
        get: function () {
            return this._incrementSleepOnRetry;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RetryOptions.prototype, "maxRetries", {
        get: function () {
            return this._maxRetries;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RetryOptions.prototype, "msRetrySleep", {
        get: function () {
            return this._msRetrySleep;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RetryOptions.prototype, "multiplier", {
        get: function () {
            return this._multiplier;
        },
        enumerable: false,
        configurable: true
    });
    return RetryOptions;
}());
exports.RetryOptions = RetryOptions;
//# sourceMappingURL=utils.js.map