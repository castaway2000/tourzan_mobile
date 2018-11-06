package com.tourzan;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.onfido.android.sdk.capture.ExitCode;
import com.onfido.android.sdk.capture.Onfido;
import com.onfido.android.sdk.capture.OnfidoConfig;
import com.onfido.android.sdk.capture.OnfidoFactory;
import com.onfido.android.sdk.capture.errors.OnfidoException;
import com.onfido.android.sdk.capture.ui.options.FlowStep;
import com.onfido.android.sdk.capture.upload.Captures;
import com.onfido.api.client.data.Applicant;

import org.intellij.lang.annotations.Flow;

import java.util.GregorianCalendar;

public class OnfidoSDK extends ReactContextBaseJavaModule {

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_SHOW_ONFIDO = "E_FAILED_TO_SHOW_ONFIDO";
    private final Onfido client;
    private Callback mSuccessCallback;
    private Callback mErrorCallback;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(final Activity activity, int requestCode, int resultCode, Intent data) {

            client.handleActivityResult(resultCode, data, new Onfido.OnfidoResultListener() {
                @Override
                public void userCompleted(Applicant applicant, Captures captures) {
                    //communicate with your backend and initiate the check

                    if (mSuccessCallback != null) {
                        mSuccessCallback.invoke(applicant.getId());
                    }
                }

                @Override
                public void userExited(ExitCode exitCode, Applicant applicant) {
                    //User left the sdk flow without completing it

                    if (mErrorCallback != null) {
                        mErrorCallback.invoke(exitCode.toString());
                    }
                }

                @Override
                public void onError(OnfidoException exception, Applicant applicant) {
                    // An exception occurred during the flow

                    if (mErrorCallback != null) {
                        mErrorCallback.invoke(exception.toString());
                    }

                }
            });
        }
    };

    public OnfidoSDK(ReactApplicationContext reactContext) {
        super(reactContext);
        client = OnfidoFactory.create(reactContext).getClient();
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "OnfidoSDK";
    }

    @ReactMethod
    public void
    startSDK(String applicantId, Callback successCallback, Callback errorCallback) {

        String token = "test_tLlvRsGwFHHBHZr_mw02f372SkQwFAb3";

        Activity currentActivity = getCurrentActivity();
        mSuccessCallback = successCallback;
        mErrorCallback = errorCallback;

        if (currentActivity == null) {
            mErrorCallback.invoke(E_ACTIVITY_DOES_NOT_EXIST);
            return;
        }

        try {
            final FlowStep[] defaultStepsWithWelcomeScreen = {
                    FlowStep.WELCOME,                       //Welcome step with a step summary, Optional
                    FlowStep.CAPTURE_DOCUMENT,              //Document Capture Step
                    FlowStep.CAPTURE_FACE,                  //Face Capture Step
                    FlowStep.FINAL                          //Final Screen Step, Optional
            };

            final OnfidoConfig config = OnfidoConfig.builder()
                    .withToken(token)
                    .withCustomFlow(defaultStepsWithWelcomeScreen)
                    .withApplicant(applicantId)
                    .build();


            client.startActivityForResult(currentActivity, 1, config);
        }
        catch (Exception e) {
            mErrorCallback.invoke(E_FAILED_TO_SHOW_ONFIDO);
            mErrorCallback = null;
        }
    }
}