'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDirectChat, getChats } from '@/entities/chat/api/chat.api';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  });
};

export const useCreateDirectChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDirectChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
