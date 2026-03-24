'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AuthNotAuthenticatedError } from '@/features/auth/model/errors/auth.errors';
import { useMe } from '@/features/auth/model/hooks/useMe';

export default function ChatPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMe();

  useEffect(() => {
    if (error instanceof AuthNotAuthenticatedError) {
      router.replace('/');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[color:var(--background)]">
        <p className="text-sm text-[color:var(--text-secondary)]">Loading...</p>
      </main>
    );
  }

  if (error && !(error instanceof AuthNotAuthenticatedError)) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[color:var(--background)]">
        <p className="text-sm text-[color:var(--text-secondary)]">
          Something went wrong while loading your profile.
        </p>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[color:var(--background)]">
      <p className="text-lg text-[color:var(--text-primary)]">
        Logged in as {data.user.displayName}
      </p>
    </main>
  );
}
