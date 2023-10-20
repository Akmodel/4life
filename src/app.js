"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookieParser = require("cookie-parser");
var dotenv = require("dotenv");
var express = require("express");
var AuthController_1 = require("./controllers/AuthController");
var BroadcastController_1 = require("./controllers/BroadcastController");
var CallController_1 = require("./controllers/CallController");
var RecordingController_1 = require("./controllers/RecordingController");
var SessionController_1 = require("./controllers/SessionController");
var AuthService_1 = require("./services/AuthService");
var chalk = require("chalk");
var config_1 = require("./config");
var authService = AuthService_1.AuthService.getInstance();
dotenv.config();
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());
app.use('/call', CallController_1.app);
app.use('/sessions', authService.authorizer, SessionController_1.app);
app.use('/recordings', authService.authorizer, RecordingController_1.app);
app.use('/recordings/:recordingId', RecordingController_1.proxyGETRecording);
app.use('/broadcasts', authService.authorizer, BroadcastController_1.app);
app.use('/auth', AuthController_1.app);
// Accept selfsigned certificates if CALL_OPENVIDU_CERTTYPE=selfsigned
if (config_1.CALL_OPENVIDU_CERTTYPE === 'selfsigned') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
}
app.listen(config_1.SERVER_PORT, function () {
    var credential = chalk.yellow;
    var text = chalk.cyanBright;
    var enabled = chalk.greenBright;
    var disabled = chalk.redBright;
    console.log(' ');
    console.log('---------------------------------------------------------');
    console.log(' ');
    console.log('OpenVidu Call Server is listening on port', text(config_1.SERVER_PORT));
    console.log(' ');
    console.log('---------------------------------------------------------');
    console.log('OPENVIDU URL: ', text(config_1.OPENVIDU_URL));
    console.log('OPENVIDU SECRET: ', credential(config_1.OPENVIDU_SECRET));
    console.log('CALL OPENVIDU CERTTYPE: ', text(config_1.CALL_OPENVIDU_CERTTYPE));
    console.log('CALL RECORDING: ', config_1.CALL_RECORDING === 'ENABLED' ? enabled(config_1.CALL_RECORDING) : disabled(config_1.CALL_RECORDING));
    console.log('CALL BROADCAST: ', config_1.CALL_BROADCAST === 'ENABLED' ? enabled(config_1.CALL_BROADCAST) : disabled(config_1.CALL_BROADCAST));
    console.log('---------------------------------------------------------');
    console.log(' ');
    console.log('CALL PRIVATE ACCESS: ', config_1.CALL_PRIVATE_ACCESS === 'ENABLED' ? enabled(config_1.CALL_PRIVATE_ACCESS) : disabled(config_1.CALL_PRIVATE_ACCESS));
    if (config_1.CALL_PRIVATE_ACCESS === 'ENABLED') {
        console.log('CALL USER: ', credential(config_1.CALL_USER));
        console.log('CALL SECRET: ', credential(config_1.CALL_SECRET));
    }
    console.log('CALL ADMIN PASSWORD: ', credential(config_1.CALL_ADMIN_SECRET));
    console.log('---------------------------------------------------------');
    console.log(' ');
});
