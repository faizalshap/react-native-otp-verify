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
export declare function getNativeEventEmitterModule(): any;
