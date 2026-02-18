import { NativeModules } from 'react-native';
/**
 * Returns a `NativeEventEmitter`-compatible native module for `OtpVerify`.
 *
 * @returns A non-null module object containing `addListener` and
 * `removeListeners` functions. Missing methods are added as no-op
 * implementations.
 *
 * @remarks
 * Side effects:
 * - Mutates the resolved `NativeModules.OtpVerify` object in place when either
 *   `addListener` or `removeListeners` is missing.
 *
 * Error behavior:
 * - This function does not intentionally throw.
 */
export function getNativeEventEmitterModule() {
  const nativeModule = NativeModules.OtpVerify ?? {};
  if (typeof nativeModule.addListener !== 'function') {
    nativeModule.addListener = () => {};
  }
  if (typeof nativeModule.removeListeners !== 'function') {
    nativeModule.removeListeners = () => {};
  }
  return nativeModule;
}
//# sourceMappingURL=nativeEventEmitterModule.js.map