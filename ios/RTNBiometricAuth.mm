#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RTNBiometricAuth, NSObject)

RCT_EXTERN_METHOD(checkBiometricsAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authenticateWithBiometrics:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
