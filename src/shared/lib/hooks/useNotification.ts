'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';

type NotifyOptions = Parameters<typeof toast>[1];

export const useNotification = () => {
  return useMemo(
    () => ({
      success: (title: string, options?: NotifyOptions) =>
        toast.success(title, options),
      error: (title: string, options?: NotifyOptions) =>
        toast.error(title, options),
      warning: (title: string, options?: NotifyOptions) =>
        toast.warning(title, options),
      info: (title: string, options?: NotifyOptions) => toast.info(title, options),
    }),
    [],
  );
};
