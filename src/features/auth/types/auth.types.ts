import type { AuthResponseDto, GoogleSignInDto } from '@/api/generated/schemas';

import type { AuthProvider } from '@/features/auth/constants/auth.provider';

export type AuthenticateParams = {
  provider: AuthProvider;
};

export type AuthResult = {
  provider: AuthProvider;
  accessToken: string;
  user: AuthResponseDto['user'];
  idToken?: string;
};

export type GoogleAuthResult = {
  idToken: string;
  nonce?: string;
};

export type GoogleSignInPayload = GoogleSignInDto;

