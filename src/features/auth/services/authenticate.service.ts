import { AuthProvider } from '@/features/auth/constants/auth.provider';
import { resolveAuthService } from '@/features/auth/services/auth.provider';
import { signInWithGoogle } from '@/features/auth/services/auth.service';

export const authenticateWithGoogle = async () => {
  const service = resolveAuthService(AuthProvider.GOOGLE);

  if (!service) {
    throw new Error('Auth provider not configured.');
  }

  const googleResult = await service.auth();
  await signInWithGoogle({
    idToken: googleResult.idToken,
    nonce: googleResult.nonce,
  });
};
