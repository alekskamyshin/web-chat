'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { ChatListResponseDto, MessageDto } from '@/api/generated/schemas';
import { connectSocket, disconnectSocket } from '@/features/socket/socket.service';
import { useMe } from '@/features/auth/model/hooks/useMe';

type UseChatSocketParams = {
  enabled: boolean;
  selectedChatId?: string | null;
};

export const useChatSocket = ({
  enabled,
  selectedChatId, }: UseChatSocketParams) => {
  const queryClient = useQueryClient();
  const selectedChatIdRef = useRef<string | null>(null);
	const {data: userData} = useMe()
	const isChatsRefetchingRef = useRef(false);
	const pendingChatsRefetchRef = useRef(false);

	const userId = userData?.user.id

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId ?? null;
		if ( selectedChatId ) {
			clearUnreadForCurrentChat()
		}
  }, [selectedChatId]);

	const refetchChatsWithPending = async () => {
		if (isChatsRefetchingRef.current) {
			pendingChatsRefetchRef.current = true;
			return
		}

		isChatsRefetchingRef.current = true;

		try {
			await queryClient.invalidateQueries({ queryKey: ['chats'] })
			if (pendingChatsRefetchRef.current) {
				pendingChatsRefetchRef.current = false;
				isChatsRefetchingRef.current = true;
				await queryClient.invalidateQueries({ queryKey: ['chats'] })
			}
		} catch(err: unknown) {
			if (  err instanceof Error ) {
				console.log('Error while re-fetching ', err?.message)
			} else {
				console.log('Error while re-fetching ', err)
			}
		} finally {
				isChatsRefetchingRef.current = false;
		}
	}

	const clearUnreadForCurrentChat = () => {
		queryClient.setQueryData<ChatListResponseDto>(['chats'], (existing) => {
			const activeChatId = selectedChatIdRef.current;

			if ( !existing?.items.length ) {
				return existing
			}

			return {
				...existing,
				items: existing.items.map((chat) => {
					return {...chat, unreadCount: chat.id ===  activeChatId ? 0 : chat.unreadCount} 
				}),
			};
		})
	}

	const updateLastMessageUnread = (message: MessageDto) => {
		queryClient.setQueryData<ChatListResponseDto>(['chats'], (existing) => {
			const activeChatId = selectedChatIdRef.current;

			if ( !existing?.items.length ) {
				return existing
			}

			return {
				...existing,
				items: existing.items.map((chat) => {
					if (chat.id !== message.chatId) {
						return chat;
					}

					let unreadCount = chat.unreadCount;

					if ( activeChatId === message.chatId ) {
						unreadCount = 0
					}  else if ( message.senderId !== userId ) {
						unreadCount = chat.unreadCount + 1
					}

					return {
						...chat,
						lastMessage: {
							id: message.id,
							content: message.content,
							senderId: message.senderId,
							createdAt: message.createdAt,
						},
						unreadCount,
					};
				}),
			};
		})
	}

	const addMessage = (message: MessageDto) => {
		const activeChatId = selectedChatIdRef.current;

		if (activeChatId === message.chatId) {
			queryClient.setQueryData<MessageDto[]>(
				['messages', message.chatId],
				(existing) => {
					if (!existing) {
						return [message];
					}

					const messageExists = existing.find((ex) => ex.id === message.id);

					return messageExists ? existing : [...existing, message];
				},
			);
		}
	}


  useEffect(() => {
    if (!enabled) {
      return;
    }

		if ( !userId ) {
			return;
		}

    const socket = connectSocket();

    const handleMessage = (message: MessageDto) => {
			const chatData = queryClient.getQueryData<ChatListResponseDto>(['chats'])
			const activeChatId = selectedChatIdRef.current;
			const isMessageForActiveChat = activeChatId === message.chatId
			const doesChatExist = chatData?.items.find( c => c.id === message.chatId)

			if ( isMessageForActiveChat ) {
				addMessage(message)
			}

			if ( !doesChatExist ) {
				refetchChatsWithPending()
				return;
			}

			updateLastMessageUnread(message);
    };

    const handleError = (payload: { message?: string }) => {
      console.log(payload?.message || 'Socket error');
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:error', handleError);

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off('chat:error', handleError);
      disconnectSocket();
    };
  }, [enabled, queryClient, userId]);
};
