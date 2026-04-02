'use client';

import { useQuery } from '@tanstack/react-query';

import { getMessages } from '../../api/messages.api';

export const useMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId as string),
		enabled: !!chatId
  });
};
