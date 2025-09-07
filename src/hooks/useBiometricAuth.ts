import { useState, useCallback, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const handleAuthError = (error: unknown): string => {
  if (typeof error === 'string') {
    const errorLower = error.toLowerCase();
    if (errorLower.includes('cancelled') || errorLower.includes('user cancel')) {
      return 'Authentication was cancelled';
    }
    if (errorLower.includes('locked') || errorLower.includes('too many attempts')) {
      return 'Too many failed attempts. Please try again later.';
    }
    if (errorLower.includes('not enrolled') || errorLower.includes('no biometric')) {
      return 'Biometric authentication is not set up on this device. Please set it up in your device settings.';
    }
    if (errorLower.includes('not available')) {
      return 'Biometric authentication is not available on this device.';
    }
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Authentication failed. Please try again.';
};

export function useBiometricAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  const checkBiometricSupport = useCallback(async (): Promise<boolean> => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (available && biometryType) {
        setBiometryType(biometryType);
        return true;
      }
      
      try {
        const { available: deviceCredentialsAvailable } = await rnBiometrics.isSensorAvailable();
        if (deviceCredentialsAvailable) {
          setBiometryType('DeviceCredentials');
          return true;
        }
      } catch (error) {
        console.log('Device credentials not available:', error);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }, []);

  const authenticate = useCallback(async (reason = 'Authenticate to continue'): Promise<boolean> => {
    try {
      setIsAuthenticating(true);
      
      const isSupported = await checkBiometricSupport();
      if (!isSupported) {
        Alert.alert(
          'Authentication Required',
          'Please set up biometric authentication (Face ID/Touch ID) or device passcode to use this feature.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const promptConfig = {
        promptMessage: reason,
        cancelButtonText: 'Cancel',
        fallbackPrompt: {
          title: 'Authentication Required',
          subtitle: '',
          description: reason,
          cancelButton: 'Cancel',
        },
      };

      const { success, error } = await rnBiometrics.simplePrompt(promptConfig);

      if (success) {
        return true;
      }
      
      if (error) {
        console.error('Authentication error:', error);
        if (error.includes('cancelled')) {
          return false;
        }
        throw new Error(error);
      }
      
      return false;
    } catch (error) {
      const errorMessage = handleAuthError(error);
      console.error('Authentication error:', error);
      
      if (errorMessage !== 'Authentication was cancelled') {
        Alert.alert('Authentication Error', errorMessage);
      }
      
      return false
    } finally {
      setIsAuthenticating(false);
    }
  }, [checkBiometricSupport]);

  const authTypeName = useMemo(() => {
    if (!biometryType) return 'Authentication';
    
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Biometric';
      case 'DeviceCredentials':
        return Platform.OS === 'ios' ? 'Passcode' : 'Device Credentials';
      default:
        return 'Authentication';
    }
  }, [biometryType]);

  return {
    isAuthenticating,
    biometryType,
    authTypeName,
    authenticate,
    checkBiometricSupport,
  };
}
