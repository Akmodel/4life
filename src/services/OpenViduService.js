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
exports.OpenViduService = void 0;
var openvidu_node_client_1 = require("openvidu-node-client");
var config_1 = require("../config");
var utils_1 = require("../utils");
var OpenViduService = /** @class */ (function () {
    function OpenViduService() {
        this.MODERATOR_TOKEN_NAME = 'ovCallModeratorToken';
        this.PARTICIPANT_TOKEN_NAME = 'ovCallParticipantToken';
        this.moderatorsCookieMap = new Map();
        this.participantsCookieMap = new Map();
        this.openvidu = new openvidu_node_client_1.OpenVidu(config_1.OPENVIDU_URL, config_1.OPENVIDU_SECRET);
        if (process.env.NODE_ENV === 'production')
            this.openvidu.enableProdMode();
    }
    OpenViduService.getInstance = function () {
        if (!OpenViduService.instance) {
            OpenViduService.instance = new OpenViduService();
        }
        return OpenViduService.instance;
    };
    OpenViduService.prototype.getBasicAuth = function () {
        return this.openvidu.basicAuth;
    };
    OpenViduService.prototype.getDateFromCookie = function (cookies) {
        try {
            var cookieToken = cookies[this.MODERATOR_TOKEN_NAME] || cookies[this.PARTICIPANT_TOKEN_NAME];
            if (!!cookieToken) {
                var cookieTokenUrl = new URL(cookieToken);
                var date = cookieTokenUrl === null || cookieTokenUrl === void 0 ? void 0 : cookieTokenUrl.searchParams.get('createdAt');
                return Number(date);
            }
            else {
                return Date.now();
            }
        }
        catch (error) {
            return Date.now();
        }
    };
    OpenViduService.prototype.getSessionIdFromCookie = function (cookies) {
        try {
            var cookieToken = cookies[this.MODERATOR_TOKEN_NAME] || cookies[this.PARTICIPANT_TOKEN_NAME];
            var cookieTokenUrl = new URL(cookieToken);
            return cookieTokenUrl === null || cookieTokenUrl === void 0 ? void 0 : cookieTokenUrl.searchParams.get('sessionId');
        }
        catch (error) {
            console.log('Session cookie not found', cookies);
            console.error(error);
            return '';
        }
    };
    OpenViduService.prototype.getSessionIdFromRecordingId = function (recordingId) {
        return recordingId.split('~')[0];
    };
    OpenViduService.prototype.isModeratorSessionValid = function (sessionId, cookies) {
        try {
            if (!this.moderatorsCookieMap.has(sessionId))
                return false;
            if (!cookies[this.MODERATOR_TOKEN_NAME])
                return false;
            var storedTokenUrl = new URL(this.moderatorsCookieMap.get(sessionId).token);
            var cookieTokenUrl = new URL(cookies[this.MODERATOR_TOKEN_NAME]);
            var cookieSessionId = cookieTokenUrl.searchParams.get('sessionId');
            var cookieToken = cookieTokenUrl.searchParams.get(this.MODERATOR_TOKEN_NAME);
            var cookieDate = cookieTokenUrl.searchParams.get('createdAt');
            var storedToken = storedTokenUrl.searchParams.get(this.MODERATOR_TOKEN_NAME);
            var storedDate = storedTokenUrl.searchParams.get('createdAt');
            return sessionId === cookieSessionId && cookieToken === storedToken && cookieDate === storedDate;
        }
        catch (error) {
            return false;
        }
    };
    OpenViduService.prototype.isParticipantSessionValid = function (sessionId, cookies) {
        var _this = this;
        var _a;
        try {
            if (!this.participantsCookieMap.has(sessionId))
                return false;
            if (!cookies[this.PARTICIPANT_TOKEN_NAME])
                return false;
            var storedTokens = this.participantsCookieMap.get(sessionId);
            var cookieTokenUrl = new URL(cookies[this.PARTICIPANT_TOKEN_NAME]);
            var cookieSessionId_1 = cookieTokenUrl.searchParams.get('sessionId');
            var cookieToken_1 = cookieTokenUrl.searchParams.get(this.PARTICIPANT_TOKEN_NAME);
            var cookieDate_1 = cookieTokenUrl.searchParams.get('createdAt');
            return ((_a = storedTokens === null || storedTokens === void 0 ? void 0 : storedTokens.some(function (token) {
                var storedTokenUrl = new URL(token);
                var storedToken = storedTokenUrl.searchParams.get(_this.PARTICIPANT_TOKEN_NAME);
                var storedDate = storedTokenUrl.searchParams.get('createdAt');
                return sessionId === cookieSessionId_1 && cookieToken_1 === storedToken && cookieDate_1 === storedDate;
            })) !== null && _a !== void 0 ? _a : false);
        }
        catch (error) {
            return false;
        }
    };
    OpenViduService.prototype.createSession = function (sessionId, retryOptions) {
        if (retryOptions === void 0) { retryOptions = new utils_1.RetryOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var sessionProperties, session, error_1, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!retryOptions.canRetry()) return [3 /*break*/, 9];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 8]);
                        console.log('Creating session: ', sessionId);
                        sessionProperties = { customSessionId: sessionId };
                        return [4 /*yield*/, this.openvidu.createSession(sessionProperties)];
                    case 2:
                        session = _a.sent();
                        return [4 /*yield*/, session.fetch()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, session];
                    case 4:
                        error_1 = _a.sent();
                        status_1 = error_1.message;
                        if (!((status_1 >= 500 && status_1 <= 504) || status_1 == 404)) return [3 /*break*/, 6];
                        // Retry is used for OpenVidu Enterprise High Availability for reconnecting purposes
                        // to allow fault tolerance
                        // 502 to 504 are returned when OpenVidu Server is not available (stopped, not reachable, etc...)
                        // 404 is returned when the session does not exist which is returned by fetch operation in createSession
                        // and it is not a possible error after session creation
                        console.log('Error creating session: ', status_1, 'Retrying session creation...', retryOptions);
                        return [4 /*yield*/, retryOptions.retrySleep()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        console.log("Unknown error creating session: ", error_1);
                        throw error_1;
                    case 7: return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 0];
                    case 9: throw new Error('Max retries exceeded while creating connection');
                }
            });
        });
    };
    OpenViduService.prototype.createConnection = function (session, nickname, role, retryOptions) {
        if (retryOptions === void 0) { retryOptions = new utils_1.RetryOptions(); }
        return __awaiter(this, void 0, void 0, function () {
            var connectionProperties, connection, error_2, status_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!retryOptions.canRetry()) return [3 /*break*/, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 7]);
                        console.log("Requesting token for session " + session.sessionId);
                        connectionProperties = { role: role };
                        if (!!nickname) {
                            connectionProperties.data = JSON.stringify({
                                openviduCustomConnectionId: nickname
                            });
                        }
                        console.log('Connection Properties:', connectionProperties);
                        return [4 /*yield*/, session.createConnection(connectionProperties)];
                    case 2:
                        connection = _a.sent();
                        this.edition = new URL(connection.token).searchParams.get('edition');
                        return [2 /*return*/, connection];
                    case 3:
                        error_2 = _a.sent();
                        status_2 = Number(error_2.message);
                        if (!(status_2 >= 500 && status_2 <= 504)) return [3 /*break*/, 5];
                        // Retry is used for OpenVidu Enterprise High Availability for reconnecting purposes
                        // to allow fault tolerance
                        console.log('Error creating connection: ', status_2, 'Retrying connection creation...', retryOptions);
                        return [4 /*yield*/, retryOptions.retrySleep()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.log("Unknown error creating connection: ", error_2);
                        throw error_2;
                    case 6: return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 0];
                    case 8: throw new Error('Max retries exceeded while creating connection');
                }
            });
        });
    };
    OpenViduService.prototype.startRecording = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.openvidu.startRecording(sessionId)];
            });
        });
    };
    OpenViduService.prototype.stopRecording = function (recordingId) {
        return this.openvidu.stopRecording(recordingId);
    };
    OpenViduService.prototype.deleteRecording = function (recordingId) {
        return this.openvidu.deleteRecording(recordingId);
    };
    OpenViduService.prototype.getRecording = function (recordingId) {
        return this.openvidu.getRecording(recordingId);
    };
    OpenViduService.prototype.listAllRecordings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openvidu.listRecordings()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenViduService.prototype.listRecordingsBySessionIdAndDate = function (sessionId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var recordingList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listAllRecordings()];
                    case 1:
                        recordingList = _a.sent();
                        return [2 /*return*/, recordingList.filter(function (recording) {
                                var recordingDateEnd = recording.createdAt + recording.duration * 1000;
                                return recording.sessionId === sessionId && recordingDateEnd >= date;
                            })];
                }
            });
        });
    };
    OpenViduService.prototype.startBroadcasting = function (sessionId, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.openvidu.startBroadcast(sessionId, url)];
            });
        });
    };
    OpenViduService.prototype.stopBroadcasting = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.openvidu.stopBroadcast(sessionId)];
            });
        });
    };
    OpenViduService.prototype.isPRO = function () {
        return this.edition.toUpperCase() === 'PRO';
    };
    OpenViduService.prototype.isCE = function () {
        return this.edition.toUpperCase() === 'CE';
    };
    return OpenViduService;
}());
exports.OpenViduService = OpenViduService;
