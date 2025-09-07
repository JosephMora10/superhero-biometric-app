import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  authenticate(): Promise<boolean>;
  getConstants(): {
    isAvailable: boolean;
    biometryType: string;
  };
}

export default TurboModuleRegistry.get<Spec>('BiometricAuthModule') as Spec | null;
