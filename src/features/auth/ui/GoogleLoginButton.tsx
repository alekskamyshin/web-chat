'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signInWithGoogle } from '@/features/auth/services/auth.service';
import { renderGoogleSignInButton } from '@/features/auth/providers/google/google.web';

export default function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = buttonRef.current;
		if (!container) return;

		let cancelled = false;

		renderGoogleSignInButton({
			container,
			onCredential: async (idToken) => {
				if (cancelled) return;

				setIsLoading(true);

				try {
					await signInWithGoogle({ idToken });
					router.replace('/chat');
				} catch (error) {
					console.log(error);
					if (!cancelled) setIsLoading(false);
				}
			},
			onError: (error) => {
				console.log(error);
			},
		}).catch((error) => {
				console.log(error);
			});

		return () => {
			cancelled = true;
			container.innerHTML = '';
		};
	}, []);

  return (
    <div
      className="flex w-full items-center gap-3"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="flex h-8 w-8 items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
        </span>
      ) : null}
      <div
        className="flex-1 min-h-[44px]"
        style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.7 : 1 }}
      >
        <div ref={buttonRef} className="w-full min-h-[44px]" />
      </div>
    </div>
  );
}
