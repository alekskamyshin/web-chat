'use client';

import { useQuery } from '@tanstack/react-query';

import { getChats } from '@/entities/chat/api/chat.api';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  });
};
