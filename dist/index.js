"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var RNOtpVerify = react_native_1.NativeModules.RNOtpVerify;
var OtpVerify = {
    getOtp: RNOtpVerify.getOtp,
    getHash: RNOtpVerify.getHash,
    addListener: function (handler) {
        return react_native_1.DeviceEventEmitter
            .addListener('com.faizalshap.otpVerify:otpReceived', handler);
    },
    removeListener: function () { return react_native_1.DeviceEventEmitter.removeAllListeners('com.faizalshap.otpVerify:otpReceived'); },
};
exports.default = OtpVerify;
