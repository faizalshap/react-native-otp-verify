import { DeviceEventEmitter, NativeModules } from 'react-native';

const RNOtpVerify = NativeModules.RNOtpVerify;

class OtpVerify {

    getOtp: () => Promise<boolean> = RNOtpVerify.getOtp;

    getHash: () => Promise<string[]> = RNOtpVerify.getHash;

    addListener = (handler: (value: string) => any) =>
        DeviceEventEmitter
            .addListener('com.faizalshap.otpVerify:otpReceived', handler);

    removeListener = () =>
        DeviceEventEmitter
            .removeAllListeners('com.faizalshap.otpVerify:otpReceived');
}

export default OtpVerify;
