import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSocket } from '../socket.service';
import { MessageDto } from '@/api/generated/schemas';

type SendMessageVariables = {
  chatId: string;
  content: string;
  senderId?: string;
};

type OptimisticContext = {
  previousMessages: MessageDto[] | undefined;
  tempId: string;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content }: SendMessageVariables) => {
      const socket = getSocket();

			if ( !socket ) {
				throw new Error('No socket available')
			}

      return new Promise<MessageDto>((resolve, reject) => {
        socket.emit('chat:send', { chatId, content }, (ack) => {
          if (ack.ok && ack.data) {
            resolve(ack.data);
            return;
          }

          reject(new Error(ack.error || 'Unable to send message.'));
        });
      });
    },
    onMutate: async ({ chatId, content, senderId }) => {
      const queryKey = ['messages', chatId];
      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData<MessageDto[]>(queryKey);
      const now = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: MessageDto = {
        id: tempId,
        chatId,
        senderId: senderId || 'local',
        content,
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<MessageDto[]>(queryKey, (current) => {
        const next = current ? [...current, optimisticMessage] : [optimisticMessage];
        return next;
      });

      return { previousMessages, tempId };
    },
    onSuccess: (data, variables, context) => {
      const queryKey = ['messages', variables.chatId];
      queryClient.setQueryData<MessageDto[]>(queryKey, (current) => {
        if (!current) {
          return [data];
        }

        return current.filter((message) =>
          message.id !== context?.tempId 
        );
      });
    },
    onError: (_error, variables, context) => {
      const queryKey = ['messages', variables.chatId];
      queryClient.setQueryData<MessageDto[]>(queryKey, () => context?.previousMessages);
    },
  });
};
