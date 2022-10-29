import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { useEffect, useState } from 'react';

const LINKING_ERROR =
  `The package 'react-native-otp-verify' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const RNOtpVerify = NativeModules.OtpVerify
  ? NativeModules.OtpVerify
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const eventEmitter = new NativeEventEmitter(RNOtpVerify);

interface OtpVerify {
  getOtp: () => Promise<boolean>;
  getHash: () => Promise<string[]>;
  startOtpListener: (
    handler: (value: string) => any
  ) => Promise<import('react-native').EmitterSubscription>;
  addListener: (
    handler: (value: string) => any
  ) => import('react-native').EmitterSubscription;
  removeListener: () => void;
}

export function getOtp(): Promise<boolean> {
  return RNOtpVerify.getOtp();
}

export function startOtpListener(
  handler: (value: string) => any
): Promise<import('react-native').EmitterSubscription> {
  return getOtp().then(() => addListener(handler));
}

export const useOtpVerify = ({ numberOfDigits } = { numberOfDigits: 0 }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [timeoutError, setTimeoutError] = useState<boolean>(false);
  const [hash, setHash] = useState<string[] | null>([]);

  const handleMessage = (response: string) => {
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
  useEffect(() => {
    if (Platform.OS === 'ios') return;
    getHash().then(setHash);
    startOtpListener(handleMessage);
    return () => {
      removeListener();
    };
  }, []);
  const startListener = () => {
    if (Platform.OS === 'ios') return;
    setOtp('');
    setMessage('');
    startOtpListener(handleMessage);
  };
  const stopListener = () => {
    if (Platform.OS === 'ios') return;
    removeListener();
  };
  return { otp, message, hash, timeoutError, stopListener, startListener };
};

export function getHash(): Promise<string[]> {
  return RNOtpVerify.getHash();
}

export function addListener(
  handler: (value: string) => any
): import('react-native').EmitterSubscription {
  return eventEmitter.addListener(
    'com.faizalshap.otpVerify:otpReceived',
    handler
  );
}

export function removeListener(): void {
  return eventEmitter.removeAllListeners(
    'com.faizalshap.otpVerify:otpReceived'
  );
}

const OtpVerify: OtpVerify = {
  getOtp,
  getHash,
  addListener,
  removeListener,
  startOtpListener,
};

export default OtpVerify;
