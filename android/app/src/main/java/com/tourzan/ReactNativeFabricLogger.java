/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.tourzan;

import android.util.Log;

import com.crashlytics.android.Crashlytics;
import com.facebook.common.logging.LoggingDelegate;

import java.io.PrintWriter;
import java.io.StringWriter;


/**
 * Default implementation of {@link LoggingDelegate}.
 */
public class ReactNativeFabricLogger implements LoggingDelegate {

  public static final ReactNativeFabricLogger sInstance = new ReactNativeFabricLogger();

  private String mApplicationTag = "unknown";
  private int mMinimumLoggingLevel = Log.WARN;

  public static ReactNativeFabricLogger getInstance() {
    return sInstance;
  }

    private ReactNativeFabricLogger() {
  }

  /**
   * Sets an application tag that is used for checking if a log line is loggable and also
   * to prefix to all log lines.
   *
   * @param tag the tag
   */
  public void setApplicationTag(String tag) {
    mApplicationTag = tag;
  }


  @Override
  public void setMinimumLoggingLevel(int level) {
    mMinimumLoggingLevel = level;
  }

  @Override
  public int getMinimumLoggingLevel() {
    return mMinimumLoggingLevel;
  }

  @Override
  public boolean isLoggable(int level) {
    return mMinimumLoggingLevel <= level;
  }

  @Override
  public void v(String tag, String msg) {
    println(Log.VERBOSE, tag, msg);
  }

  @Override
  public void v(String tag, String msg, Throwable tr) {
    println(Log.VERBOSE, tag, msg, tr);
  }

  @Override
  public void d(String tag, String msg) {
    println(Log.DEBUG, tag, msg);
  }

  @Override
  public void d(String tag, String msg, Throwable tr) {
    println(Log.DEBUG, tag, msg, tr);
  }

  @Override
  public void i(String tag, String msg) {
    println(Log.INFO, tag, msg);
  }

  @Override
  public void i(String tag, String msg, Throwable tr) {
    println(Log.INFO, tag, msg, tr);
  }

  @Override
  public void w(String tag, String msg) {
    println(Log.WARN, tag, msg);
  }

  @Override
  public void w(String tag, String msg, Throwable tr) {
    println(Log.WARN, tag, msg, tr);
  }

  @Override
  public void e(String tag, String msg) {
    println(Log.ERROR, tag, msg);
  }

  @Override
  public void e(String tag, String msg, Throwable tr) {
    println(Log.ERROR, tag, msg, tr);
  }

  /**
   * <p> Note: this gets forwarded to {@code android.util.Log.e} as {@code android.util.Log.wtf}
   * might crash the app.
   */
  @Override
  public void wtf(String tag, String msg) {
    println(Log.ERROR, tag, msg);
  }

  /**
   * <p> Note: this gets forwarded to {@code android.util.Log.e} as {@code android.util.Log.wtf}
   * might crash the app.
   */
  @Override
  public void wtf(String tag, String msg, Throwable tr) {
    println(Log.ERROR, tag, msg, tr);
  }

  @Override
  public void log(int priority, String tag, String msg) {
    println(priority, tag, msg);
  }

  private void println(int priority, String tag, String msg) {
    if (BuildConfig.DEBUG) {
      Log.println(priority, prefixTag(tag), msg);
    } else {
      Crashlytics.log(priority, prefixTag(tag), msg);
    }
  }

  private void println(int priority, String tag, String msg, Throwable tr) {
    if (BuildConfig.DEBUG) {
      Log.println(priority, prefixTag(tag), getMsg(msg, tr));
    } else {
      Crashlytics.log(priority, prefixTag(tag), msg);
    }
  }

  private String prefixTag(String tag) {
    if (mApplicationTag != null) {
      return mApplicationTag + ":" + tag;
    } else {
      return tag;
    }
  }

  private static String getMsg(String msg, Throwable tr) {
    return msg + '\n' + getStackTraceString(tr);
  }

  private static String getStackTraceString(Throwable tr) {
    if (tr == null) {
      return "";
    }
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    tr.printStackTrace(pw);
    return sw.toString();
  }
}
