"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListener = addListener;
exports.default = void 0;
exports.getHash = getHash;
exports.getOtp = getOtp;
exports.removeListener = removeListener;
exports.startOtpListener = startOtpListener;
exports.useOtpVerify = void 0;

var _reactNative = require("react-native");

var _react = require("react");

const LINKING_ERROR = `The package 'react-native-otp-verify' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const RNOtpVerify = _reactNative.NativeModules.OtpVerify ? _reactNative.NativeModules.OtpVerify : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
const eventEmitter = new _reactNative.NativeEventEmitter(RNOtpVerify);

function getOtp() {
  return RNOtpVerify.getOtp();
}

function startOtpListener(handler) {
  return getOtp().then(() => addListener(handler));
}

const useOtpVerify = function () {
  let {
    numberOfDigits
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    numberOfDigits: 0
  };
  const [message, setMessage] = (0, _react.useState)(null);
  const [otp, setOtp] = (0, _react.useState)(null);
  const [timeoutError, setTimeoutError] = (0, _react.useState)(false);
  const [hash, setHash] = (0, _react.useState)([]);

  const handleMessage = response => {
    if (response === 'Timeout Error.') {
      setTimeoutError(true);
    } else {
      setMessage(response);

      if (numberOfDigits && response) {
        const otpDigits = /(\d{4})/g.exec(response);
        if (otpDigits && otpDigits[1]) setOtp(otpDigits[1]);
      }
    }
  };

  (0, _react.useEffect)(() => {
    if (_reactNative.Platform.OS === 'ios') return;
    getHash().then(setHash);
    startOtpListener(handleMessage);
    return () => {
      removeListener();
    };
  }, []);

  const startListener = () => {
    if (_reactNative.Platform.OS === 'ios') return;
    setOtp('');
    setMessage('');
    startOtpListener(handleMessage);
  };

  const stopListener = () => {
    if (_reactNative.Platform.OS === 'ios') return;
    removeListener();
  };

  return {
    otp,
    message,
    hash,
    timeoutError,
    stopListener,
    startListener
  };
};

exports.useOtpVerify = useOtpVerify;

function getHash() {
  return RNOtpVerify.getHash();
}

function addListener(handler) {
  return eventEmitter.addListener('com.faizalshap.otpVerify:otpReceived', handler);
}

function removeListener() {
  return eventEmitter.removeAllListeners('com.faizalshap.otpVerify:otpReceived');
}

const OtpVerify = {
  getOtp,
  getHash,
  addListener,
  removeListener,
  startOtpListener
};
var _default = OtpVerify;
exports.default = _default;
//# sourceMappingURL=index.js.map