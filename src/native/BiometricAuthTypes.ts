import { TurboModule } from "react-native";

export enum BiometricType {
  None = 'None',
  TouchID = 'TouchID',
  FaceID = 'FaceID',
  Biometrics = 'Biometrics',
}

export enum BiometricAuthenticationErrorCode {
  AuthenticationFailed = 'AUTHENTICATION_FAILED',
  UserCancel = 'USER_CANCEL',
  SystemCancel = 'SYSTEM_CANCEL',
  BiometryLockout = 'BIOMETRY_LOCKOUT',
  BiometryNotAvailable = 'BIOMETRY_NOT_AVAILABLE',
  BiometryNotEnrolled = 'BIOMETRY_NOT_ENROLLED',
  BiometryNotSupported = 'BIOMETRY_NOT_SUPPORTED',
  UnknownError = 'UNKNOWN_ERROR',
}

export interface BiometricAuthenticationError {
  code: BiometricAuthenticationErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface BiometricAuthSpec extends TurboModule {
  authenticate(
    onSuccess: () => void,
    onFailure: (error: BiometricAuthenticationError) => void
  ): void;
}

export const BiometricAuthModuleName = 'BiometricAuthModule';
