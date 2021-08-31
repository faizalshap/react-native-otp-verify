
package com.faizal.OtpVerify;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
// import android.support.annotation.NonNull;
import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.credentials.Credential;
import com.google.android.gms.auth.api.credentials.HintRequest;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;

public class RNOtpVerifyModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {
    private static final String TAG = RNOtpVerifyModule.class.getSimpleName();
    private static final int RESOLVE_HINT = 10001;
    private GoogleApiClient apiClient;
    private Promise requestHintCallback;
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver mReceiver;
    private boolean isReceiverRegistered = false;

    public RNOtpVerifyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mReceiver = new OtpBroadcastReceiver(reactContext);
        getReactApplicationContext().addLifecycleEventListener(this);
        registerReceiverIfNecessary(mReceiver);

        reactContext.addActivityEventListener(this);
        apiClient = new GoogleApiClient.Builder(reactContext)
                .addApi(Auth.CREDENTIALS_API)
                .build();
    }

    @Override
    public String getName() {
        return "RNOtpVerify";
    }

    @ReactMethod
    public void requestHint(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        requestHintCallback = promise;


        if (currentActivity == null) {
            requestHintCallback.reject("No Activity Found", "Current Activity Null.");
            return;
        }
        try {
            HintRequest hintRequest = new HintRequest.Builder().setPhoneNumberIdentifierSupported(true).build();
            PendingIntent intent = Auth.CredentialsApi.getHintPickerIntent(apiClient, hintRequest);

            currentActivity.startIntentSenderForResult(intent.getIntentSender(), RESOLVE_HINT, null, 0, 0, 0);

        } catch (Exception e) {
            requestHintCallback.reject(e);
        }
    }

    @ReactMethod
    public void getOtp(Promise promise) {
        requestOtp(promise);
    }

    @ReactMethod
    public void getHash(Promise promise) {
        try {
            AppSignatureHelper helper = new AppSignatureHelper(reactContext);
            ArrayList<String> signatures = helper.getAppSignatures();
            WritableArray arr = Arguments.createArray();
            for (String s : signatures) {
                arr.pushString(s);
            }
            promise.resolve(arr);
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    private void registerReceiverIfNecessary(BroadcastReceiver receiver) {
        if (getCurrentActivity() == null) return;
        try {
            getCurrentActivity().registerReceiver(
                    receiver,
                    new IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
            );
            Log.d(TAG, "Receiver Registered");
            isReceiverRegistered = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void requestOtp(final Promise promise) {
        SmsRetrieverClient client = SmsRetriever.getClient(reactContext);
        Task<Void> task = client.startSmsRetriever();
        task.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                Log.e(TAG, "started sms listener");
                promise.resolve(true);
            }
        });

        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.e(TAG, "Could not start sms listener", e);
                promise.reject(e);
            }
        });
    }

    private void unregisterReceiver(BroadcastReceiver receiver) {
        if (isReceiverRegistered && getCurrentActivity() != null && receiver != null) {
            try {
                getCurrentActivity().unregisterReceiver(receiver);
                Log.d(TAG, "Receiver UnRegistered");
                isReceiverRegistered = false;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onHostResume() {
        registerReceiverIfNecessary(mReceiver);
    }

    @Override
    public void onHostPause() {
        unregisterReceiver(mReceiver);
    }

    @Override
    public void onHostDestroy() {
        unregisterReceiver(mReceiver);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == RESOLVE_HINT) {
            if (resultCode == Activity.RESULT_OK) {
                Credential credential = data.getParcelableExtra(Credential.EXTRA_KEY);
                // credential.getId(); <-- will need to process phone number string
                requestHintCallback.resolve(credential.getId());
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}

