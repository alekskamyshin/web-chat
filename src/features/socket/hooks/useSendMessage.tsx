import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSocket } from '../socket.service';
import { MessageDto } from '@/api/generated/schemas';

type SocketMessageDto = MessageDto & { clientId?: string };

type SendMessageVariables = {
  chatId: string;
  content: string;
  senderId?: string;
  clientId?: string;
};

type OptimisticContext = {
  previousMessages: MessageDto[] | undefined;
  tempId: string;
  clientId: string;
};

const createClientId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content, clientId }: SendMessageVariables) => {
      const socket = getSocket();

			if ( !socket ) {
				throw new Error('No socket available')
			}

      if (!clientId) {
        throw new Error('Missing clientId');
      }

      return new Promise<SocketMessageDto>((resolve, reject) => {
        socket.emit('chat:send', { chatId, content, clientId }, (ack) => {
          if (ack.ok && ack.data) {
            resolve(ack.data);
            return;
          }

          reject(new Error(ack.error || 'Unable to send message.'));
        });
      });
    },
    onMutate: async (variables) => {
      const { chatId, content, senderId } = variables;
      const queryKey = ['messages', chatId];
      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData<MessageDto[]>(queryKey);
      const now = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      variables.clientId = variables.clientId ?? createClientId();
      const clientId = variables.clientId;
      const optimisticMessage: SocketMessageDto = {
        id: tempId,
        chatId,
        senderId: senderId || 'local',
        content,
        createdAt: now,
        updatedAt: now,
        clientId,
      };

      queryClient.setQueryData<MessageDto[]>(queryKey, (current) => {
        const next = current ? [...current, optimisticMessage] : [optimisticMessage];
        return next;
      });

      return { previousMessages, tempId, clientId };
    },
    onSuccess: (data, variables, context) => {
      const queryKey = ['messages', variables.chatId];
      queryClient.setQueryData<MessageDto[]>(queryKey, (current) => {
        if (!current) {
          return [data];
        }

        const currentMessages = current as SocketMessageDto[];
        const hasConfirmed = currentMessages.some((message) => message.id === data.id);

        if (hasConfirmed) {
          return currentMessages.filter((message) => message.id !== context?.tempId);
        }

        let replaced = false;
        const next = currentMessages.map((message) => {
          if (message.id === context?.tempId) {
            replaced = true;
            return data;
          }

          return message;
        });

        if (!replaced) {
          const exists = next.some((message) => message.id === data.id);
          return exists ? next : [...next, data];
        }

        return next;
      });
    },
    onError: (_error, variables, context) => {
      const queryKey = ['messages', variables.chatId];
      queryClient.setQueryData<MessageDto[]>(queryKey, (current) => {
        if (!current) {
          return current;
        }

        return current.filter((message) => message.id !== context?.tempId);
      });
    },
  });
};
