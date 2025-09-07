#import "BiometricAuthModule.h"
#import <LocalAuthentication/LocalAuthentication.h>

@implementation BiometricAuthModule

RCT_EXPORT_MODULE();

- (NSDictionary<NSString *, id> *)constantsToExport
{
  LAContext *context = [[LAContext alloc] init];
  NSError *error;
  BOOL isAvailable = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
  
  NSString *biometryType = @"None";
  if (@available(iOS 11.0, *)) {
    if (context.biometryType == LABiometryTypeFaceID) {
      biometryType = @"FaceID";
    } else if (context.biometryType == LABiometryTypeTouchID) {
      biometryType = @"TouchID";
    }
  }
  
  return @{
    @"isAvailable": @(isAvailable),
    @"biometryType": biometryType
  };
}

RCT_EXPORT_METHOD(authenticate:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [[LAContext alloc] init];
  NSError *authError = nil;
  
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&authError]) {
    [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
           localizedReason:@"Authenticate to continue"
                     reply:^(BOOL success, NSError * _Nullable error) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (success) {
          resolve(@(YES));
        } else {
          NSString *errorCode = @"AUTHENTICATION_FAILED";
          NSString *errorMessage = @"Authentication failed";
          
          if (@available(iOS 11.0, *)) {
            switch (error.code) {
              case LAErrorBiometryLockout:
                errorCode = @"BIOMETRY_LOCKOUT";
                errorMessage = @"Too many failed attempts. Biometric authentication is locked.";
                break;
              case LAErrorBiometryNotAvailable:
                errorCode = @"BIOMETRY_NOT_AVAILABLE";
                errorMessage = @"Biometric authentication is not available on this device.";
                break;
              case LAErrorBiometryNotEnrolled:
                errorCode = @"BIOMETRY_NOT_ENROLLED";
                errorMessage = @"No biometric credentials enrolled. Please enroll in device settings.";
                break;
              case LAErrorUserCancel:
                errorCode = @"USER_CANCEL";
                errorMessage = @"Authentication was cancelled by user.";
                break;
              case LAErrorSystemCancel:
                errorCode = @"SYSTEM_CANCEL";
                errorMessage = @"Authentication was cancelled by the system.";
                break;
              default:
                break;
            }
          }
          
          reject(errorCode, errorMessage, error);
        }
      });
    }];
  } else {
    reject(@"BIOMETRY_NOT_AVAILABLE", @"Biometric authentication is not available on this device.", authError);
  }
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
