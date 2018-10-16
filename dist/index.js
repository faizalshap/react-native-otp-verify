"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var RNOtpVerify = react_native_1.NativeModules.RNOtpVerify;
var OtpVerify = /** @class */ (function () {
    function OtpVerify() {
        this.getOtp = RNOtpVerify.getOtp;
        this.getHash = RNOtpVerify.getHash;
        this.addListener = function (handler) {
            return react_native_1.DeviceEventEmitter
                .addListener('com.faizalshap.otpVerify:otpReceived', handler);
        };
        this.removeListener = function () {
            return react_native_1.DeviceEventEmitter
                .removeAllListeners('com.faizalshap.otpVerify:otpReceived');
        };
    }
    return OtpVerify;
}());
exports.default = OtpVerify;
