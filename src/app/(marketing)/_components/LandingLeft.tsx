export default function LandingLeft() {
  return (
    <section className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
          Direct chat
        </span>
        <div className="flex flex-col gap-4">
          <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">
            Fast, private, direct conversations.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[color:var(--text-secondary)]">
            A calm, real-time space for 1:1 chat. Sign in with Google and pick up
            instantly.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[color:var(--elevated)]" />
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                Direct chat
              </p>
              <p className="text-xs text-[color:var(--text-secondary)]">
                Online now
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--text-secondary)]">
            Live
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-[color:var(--elevated)]" />
            <div className="rounded-2xl bg-[color:var(--elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)]">
              Hey, are you free to review the draft this afternoon?
            </div>
          </div>
          <div className="flex items-start justify-end gap-3">
            <div className="max-w-[70%] rounded-2xl border border-[color:var(--accent-muted)] bg-[color:var(--accent-muted)] px-4 py-3 text-sm text-white">
              Yes. I will send notes in about an hour.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--success)]" />
            <p className="text-xs text-[color:var(--text-secondary)]">
              Maya is typing
            </p>
            <span className="ml-auto text-xs text-[color:var(--text-secondary)]">
              Sending
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-xs text-[color:var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
          Private by default
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
          Presence + typing
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
          Low-latency delivery
        </div>
      </div>
    </section>
  );
}
