import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { useEffect, useState } from 'react';
const LINKING_ERROR = `The package 'react-native-otp-verify' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const RNOtpVerify = NativeModules.OtpVerify ? NativeModules.OtpVerify : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
const eventEmitter = new NativeEventEmitter(RNOtpVerify);
export async function getOtp() {
  if (Platform.OS === 'ios') {
    console.warn('Not Supported on iOS');
    return false;
  }

  return RNOtpVerify.getOtp();
}
export function startOtpListener(handler) {
  return getOtp().then(() => addListener(handler));
}
export const useOtpVerify = function () {
  let {
    numberOfDigits
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    numberOfDigits: 0
  };
  const [message, setMessage] = useState(null);
  const [otp, setOtp] = useState(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const [hash, setHash] = useState([]);

  const handleMessage = response => {
    if (response === 'Timeout Error.') {
      setTimeoutError(true);
    } else {
      setMessage(response);

      if (numberOfDigits && response) {
        const otpDigits = new RegExp(`(\\d{${numberOfDigits}})`, 'g').exec(response);
        if (otpDigits && otpDigits[1]) setOtp(otpDigits[1]);
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.warn('Not Supported on iOS');
      return;
    }

    getHash().then(setHash);
    startOtpListener(handleMessage);
    return () => {
      removeListener();
    };
  }, []);

  const startListener = () => {
    if (Platform.OS === 'ios') {
      console.warn('Not Supported on iOS');
      return;
    }

    setOtp('');
    setMessage('');
    startOtpListener(handleMessage);
  };

  const stopListener = () => {
    if (Platform.OS === 'ios') {
      console.warn('Not Supported on iOS');
      return;
    }

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
export async function getHash() {
  if (Platform.OS === 'ios') {
    console.warn('Not Supported on iOS');
    return [];
  }

  return RNOtpVerify.getHash();
}
export async function requestHint() {
  if (Platform.OS === 'ios') {
    console.warn('Not Supported on iOS');
    return '';
  }

  return RNOtpVerify.requestHint();
}
export function addListener(handler) {
  return eventEmitter.addListener('com.faizalshap.otpVerify:otpReceived', handler);
}
export function removeListener() {
  return eventEmitter.removeAllListeners('com.faizalshap.otpVerify:otpReceived');
}
const OtpVerify = {
  getOtp,
  getHash,
  addListener,
  removeListener,
  startOtpListener,
  requestHint
};
export default OtpVerify;
//# sourceMappingURL=index.js.map