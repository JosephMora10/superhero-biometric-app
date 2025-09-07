import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import NativeBiometricAuth from '../native/NativeBiometricAuth';
import { BiometricAuthenticationError, BiometricType } from '../native/BiometricAuthTypes';

export function useNativeBiometricAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometricType | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const checkBiometricSupport = useCallback(async () => {
    try {
      if (!NativeBiometricAuth) {
        throw new Error('Biometric module not available');
      }

      const constants = NativeBiometricAuth.getConstants();
      setIsAvailable(constants.isAvailable);
      setBiometryType(constants.biometryType as BiometricType);
      
      return constants.isAvailable;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }, []);

  const authenticate = useCallback(async (reason = 'Authenticate to continue'): Promise<boolean> => {
    if (!NativeBiometricAuth) {
      throw new Error('Biometric module not available');
    }

    setIsAuthenticating(true);
    
    try {
      const isSupported = await checkBiometricSupport();
      if (!isSupported) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      const result = await NativeBiometricAuth.authenticate();
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [checkBiometricSupport]);

  return {
    isAvailable,
    isAuthenticating,
    biometryType,
    authenticate,
    checkBiometricSupport,
  };
}
