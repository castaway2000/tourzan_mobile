/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

//Add the following lines 
#import <asl.h>
#import <React/RCTLog.h>

#import "RNFIRMessaging.h"
#import "BraintreeCore.h"
#import "RCTLinkingManager.h"

@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
  [Fabric with:@[[Crashlytics class]]];
  
  //Add the following lines
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Tourzan"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  UIViewController *rootViewController = [UIViewController new];
  
  rootViewController.view = rootView;
  
  self.window.rootViewController = rootViewController;
  
  [self.window makeKeyAndVisible];
  
  [FIRApp configure];
  
  [BTAppSwitch setReturnURLScheme:self.paymentsURLScheme];
  
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  
  return YES;
}

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
  
#ifdef DEBUG
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif
  
  int aslLevel;
  switch(level) {
      case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
      case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
      case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
      case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
      case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
};


 - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
 {
   [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
  }

 #if defined(__IPHONE_11_0)
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
 {
   [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
 }
 #else
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
 {
   [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  }
 #endif

 //You can skip this method if you don't want to use local notification
 -(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [RNFIRMessaging didReceiveLocalNotification:notification];
  }

 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
    [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  }


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  if ([url.scheme localizedCaseInsensitiveCompare:self.paymentsURLScheme] == NSOrderedSame) {
    return [BTAppSwitch handleOpenURL:url options:options];
  }
  
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (NSString *)paymentsURLScheme {
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  return [NSString stringWithFormat:@"%@.%@", bundleIdentifier, @"payments"];
}

@end
