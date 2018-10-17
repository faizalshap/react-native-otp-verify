interface OtpVerify {
    getOtp: () => Promise<boolean>;
    getHash: () => Promise<string[]>;
    addListener: (handler: (value: string) => any) => import("react-native").EmitterSubscription;
    removeListener: () => void;
}
declare const OtpVerify: OtpVerify;
export default OtpVerify;
