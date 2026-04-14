'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { ChatListResponseDto, MessageDto } from '@/api/generated/schemas';
import { connectSocket, disconnectSocket } from '@/features/socket/socket.service';
import { useMe } from '@/features/auth/model/hooks/useMe';
import { useNotification } from '@/shared/lib/hooks/useNotification';

type UseChatSocketParams = {
  enabled: boolean;
  selectedChatId?: string | null;
};

type SocketMessageDto = MessageDto & { clientId?: string };

export const useChatSocket = ({
  enabled,
  selectedChatId, }: UseChatSocketParams) => {
  const queryClient = useQueryClient();
  const selectedChatIdRef = useRef<string | null>(null);
	const {data: userData} = useMe()
	const isChatsRefetchingRef = useRef(false);
	const pendingChatsRefetchRef = useRef(false);
	const lastErrorRef = useRef<{ message: string; time: number } | null>(null);
	const notify = useNotification();

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

	const addMessage = (message: SocketMessageDto) => {
		const activeChatId = selectedChatIdRef.current;

		if (activeChatId === message.chatId) {
			queryClient.setQueryData<MessageDto[]>(
				['messages', message.chatId],
				(existing) => {
					if (!existing) {
						return [message];
					}

					const current = existing as SocketMessageDto[];
					const messageExists = current.find((ex) => ex.id === message.id);

					if (messageExists) {
						return existing;
					}

					if (message.clientId) {
						let replaced = false;
						const next = current.map((ex) => {
							if (ex.clientId && ex.clientId === message.clientId) {
								replaced = true;
								return message;
							}

							return ex;
						});

						return replaced ? next : [...next, message];
					}

					return [...current, message];
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

		const handleMessage = (message: SocketMessageDto) => {
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
			const message = payload?.message || 'Socket error';
			const now = Date.now();
			const last = lastErrorRef.current;

			if (!last || last.message !== message || now - last.time > 3000) {
				lastErrorRef.current = { message, time: now };
				notify.error('Connection issue', { description: message });
			}
		};

		const handleDisconnect = (reason: string) => {
			const message = `Disconnected: ${reason}`;
			const now = Date.now();
			const last = lastErrorRef.current;

			if (!last || last.message !== message || now - last.time > 3000) {
				lastErrorRef.current = { message, time: now };
				notify.warning('Connection lost', { description: message });
			}
		};

		const handleConnectError = (error: Error) => {
			const message = error.message || 'Unable to connect to server.';
			const now = Date.now();
			const last = lastErrorRef.current;

			if (!last || last.message !== message || now - last.time > 3000) {
				lastErrorRef.current = { message, time: now };
				notify.error('Connection issue', { description: message });
			}
		};

		socket.on('chat:message', handleMessage);
		socket.on('chat:error', handleError);
		socket.on('connect_error', handleConnectError);
		socket.on('disconnect', handleDisconnect);

		return () => {
			socket.off('chat:message', handleMessage);
			socket.off('chat:error', handleError);
			socket.off('connect_error', handleConnectError);
			socket.off('disconnect', handleDisconnect);
			disconnectSocket();
		};
  }, [enabled, queryClient, userId]);
};
