import axios, { AxiosError } from 'axios';

import { getChatBackendAPI } from '@/api/generated';

import {
  AuthInvalidResponseError,
  AuthNotAuthenticatedError,
} from '@/features/auth/model/errors/auth.errors';
import {
  AuthMeResponseSchema,
  AuthResponseSchema,
} from '@/features/auth/model/schemas/auth.schema';
import type { GoogleSignInPayload } from '@/features/auth/types/auth.types';

export const getMe = async () => {
  const api = getChatBackendAPI();

  try {
    const response = await api.authControllerGetMe();

    if (!response.data?.authenticated) {
      throw new AuthNotAuthenticatedError();
    }

    const parsed = AuthMeResponseSchema.safeParse(response.data);

    if (!parsed.success) {
      throw new AuthInvalidResponseError();
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        throw new AuthNotAuthenticatedError();
      }
    }

    throw error;
  }
};

export const signInWithGoogle = async (payload: GoogleSignInPayload) => {
  try {
    const api = getChatBackendAPI();
    const response = await api.authControllerSignInWithGoogle(payload);
    const parsed = AuthResponseSchema.safeParse(response.data);

    if (!parsed.success) {
      throw new AuthInvalidResponseError('Invalid auth response from server.');
    }

    return parsed.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data && typeof error.response.data === 'string'
          ? error.response.data
          : 'Server error during sign-in.';

      throw new AuthInvalidResponseError(message);
    }

    if (error instanceof AuthInvalidResponseError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Sign-in failed.';

    throw new AuthInvalidResponseError(message);
  }
};

export const signOut = async () => {
  const api = getChatBackendAPI();
  await api.authControllerLogout();
};
