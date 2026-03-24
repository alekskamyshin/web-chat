import { AuthProvider } from '@/features/auth/constants/auth.provider';
import { authenticateWithGoogleWeb } from '@/features/auth/providers/google/google.web';
import { signOut } from '@/features/auth/services/auth.service';
import type { AuthServicesMap } from '@/features/auth/types/auth.types';

export const AuthServices = {
  [AuthProvider.GOOGLE]: {
    auth: authenticateWithGoogleWeb,
    signOut,
  },
} satisfies AuthServicesMap;

export const resolveAuthService = (provider: AuthProvider) => {
  return AuthServices[provider];
};
