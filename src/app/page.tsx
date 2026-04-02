import GoogleLoginCard from '@/features/auth/ui/GoogleLoginCard';
import LandingLeft from '@/app/(marketing)/_components/LandingLeft';

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col min-h-[100dvh] bg-[color:var(--background)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,color-mix(in_srgb,var(--primary)_30%,transparent),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 pb-20 pt-16 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
        <LandingLeft />
        <GoogleLoginCard />
      </div>
    </main>
  );
}
