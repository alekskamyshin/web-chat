import GoogleLoginButton from '@/features/auth/ui/GoogleLoginButton';

export default function GoogleLoginCard() {
  return (
    <section className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Sign in to your account
        </h2>
        <p className="text-sm text-[color:var(--text-secondary)]">
          One click with Google. No passwords to manage.
        </p>
      </div>

      <GoogleLoginButton />

      <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--elevated)] px-4 py-3 text-xs text-[color:var(--text-secondary)]">
        Signing in creates a workspace profile. We never see your Google
        password.
      </div>

      <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
        <span>Realtime, socket-powered messaging</span>
        <span>Encrypted transport</span>
      </div>
    </section>
  );
}
