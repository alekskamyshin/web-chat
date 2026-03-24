import { z } from 'zod';

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().optional().nullable(),
  displayName: z.string().min(1),
  photoUrl: z.string().url().optional().nullable(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: AuthUserSchema,
});

export const AuthMeResponseSchema = z.object({
  authenticated: z.literal(true),
  user: AuthUserSchema,
});

export type AuthResponseSchemaType = z.infer<typeof AuthResponseSchema>;
export type AuthMeResponseSchemaType = z.infer<typeof AuthMeResponseSchema>;
