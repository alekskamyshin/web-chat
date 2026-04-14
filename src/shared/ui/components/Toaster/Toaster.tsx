'use client';

import { Toaster as SonnerToaster } from 'sonner';

import { cn } from '@/shared/lib/cn';

export default function Toaster() {
  const toastBase =
    "relative overflow-hidden rounded-2xl border border-border bg-background pt-3 text-text-primary shadow-md before:absolute before:left-0 before:right-0 before:top-0 before:h-2.5 before:content-['']";

  return (
    <SonnerToaster
      position="top-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: cn(
            toastBase,
            'pr-12',
            'data-[type=success]:before:bg-success',
            'data-[type=error]:before:bg-error',
            'data-[type=warning]:before:bg-warning',
            'data-[type=info]:before:bg-link',
          ),
          title: 'text-sm font-semibold text-text-primary',
          description: 'text-xs text-text-secondary',
          actionButton:
            'rounded-2xl border border-border bg-elevated px-3 py-1 text-xs font-semibold text-text-secondary transition hover:border-accent hover:text-accent',
          cancelButton:
            'rounded-2xl border border-border bg-surface px-3 py-1 text-xs text-text-secondary transition hover:text-text-primary',
          closeButton:
            'right-3 top-3 rounded-full p-1 text-text-secondary transition hover:text-text-primary',
        },
      }}
    />
  );
}
