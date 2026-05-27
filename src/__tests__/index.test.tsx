const EVENT_NAME = 'com.faizalshap.otpVerify:otpReceived';

type StartOtpListenerModule = Pick<
  typeof import('../index'),
  'startOtpListener'
>;

const loadModule = (
  getOtp: jest.Mock<Promise<boolean>, []>,
  calls: string[] = []
) => {
  jest.resetModules();

  const subscription = {
    remove: jest.fn(),
  };
  const addListener = jest.fn(() => {
    calls.push('addListener');
    return subscription;
  });
  const NativeEventEmitter = jest.fn(() => ({
    addListener,
  }));

  jest.doMock('react-native', () => ({
    NativeEventEmitter,
    NativeModules: {
      OtpVerify: {
        getOtp,
        getHash: jest.fn(),
        requestHint: jest.fn(),
      },
    },
    Platform: {
      OS: 'android',
      select: jest.fn(({ default: defaultValue }) => defaultValue),
    },
  }));

  const otpVerify = require('../index') as StartOtpListenerModule;

  return { addListener, otpVerify, subscription };
};

describe('startOtpListener', () => {
  it('registers the JS listener before starting SmsRetriever', async () => {
    const calls: string[] = [];
    const getOtp = jest.fn(() => {
      calls.push('getOtp');
      return Promise.resolve(true);
    });
    const { addListener, otpVerify, subscription } = loadModule(getOtp, calls);
    const handler = jest.fn();

    await expect(otpVerify.startOtpListener(handler)).resolves.toBe(
      subscription
    );

    expect(addListener).toHaveBeenCalledWith(EVENT_NAME, handler);
    expect(calls).toEqual(['addListener', 'getOtp']);
  });

  it('removes the listener when SmsRetriever fails to start', async () => {
    const getOtp = jest.fn(() => Promise.reject(new Error('start failed')));
    const { otpVerify, subscription } = loadModule(getOtp);

    await expect(otpVerify.startOtpListener(jest.fn())).rejects.toThrow(
      'start failed'
    );

    expect(subscription.remove).toHaveBeenCalledTimes(1);
  });
});

export {};
