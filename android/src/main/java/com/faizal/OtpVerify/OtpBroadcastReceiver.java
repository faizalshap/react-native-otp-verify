package com.faizal.OtpVerify;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;

public class OtpBroadcastReceiver extends BroadcastReceiver {

    private ReactApplicationContext mContext;

    private static final String EVENT = "com.faizalshap.otpVerify:otpReceived";

    public OtpBroadcastReceiver(ReactApplicationContext context) {
        mContext = context;
    }

    private void receiveMessage(String message) {
        if (mContext == null) {
            return;
        }

        if (!mContext.hasActiveCatalystInstance()) {
            return;
        }

        WritableNativeMap receivedMessage = new WritableNativeMap();

        receivedMessage.putString("message", message);

        mContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT, message);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String o = intent.getAction();
        if (SmsRetriever.SMS_RETRIEVED_ACTION.equals(o)) {
            Bundle extras = intent.getExtras();
            Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);

            if (status == null) {
                return;
            }

            switch (status.getStatusCode()) {
                case CommonStatusCodes.SUCCESS:
                    // Get SMS message contents
                    String message = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);
                    receiveMessage(message);
                    if (message != null) {
                        Log.d("SMS", "" + message);
                    }
                    break;
                case CommonStatusCodes.TIMEOUT:
                    Log.d("SMS", "Timeout error");
                    mContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(EVENT, "Timeout Error.");
                    break;
            }
        }
    }
}
