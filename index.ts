import { DeviceEventEmitter, NativeModules } from 'react-native';

const RNOtpVerify = NativeModules.RNOtpVerify;

interface OtpVerify {
    getOtp: () => Promise<boolean>;
    getHash: () => Promise<string[]>;
    requestHint: () => Promise<string>;
    addListener: (handler: (value: string) => any) => import("react-native").EmitterSubscription;
    removeListener: () => void;
}

const OtpVerify: OtpVerify = {
    getOtp: RNOtpVerify?.getOtp,
    getHash: RNOtpVerify?.getHash,
    requestHint: RNOtpVerify?.requestHint,

    addListener: (handler) =>
        DeviceEventEmitter
            .addListener('com.faizalshap.otpVerify:otpReceived', handler),

    removeListener: () => DeviceEventEmitter.removeAllListeners('com.faizalshap.otpVerify:otpReceived'),
}

export default OtpVerify;
