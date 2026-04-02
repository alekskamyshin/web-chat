import { getChatBackendAPI } from '@/api/generated';
import { ChatListItemDto, CreateDirectChatDto } from '@/api/generated/schemas';

export const getChats = async () => {
  const api = getChatBackendAPI();
  const response = await api.chatsControllerListChats();

  return response.data;
};

export const createDirectChat = async (payload: CreateDirectChatDto): Promise<ChatListItemDto> => {
  const api = getChatBackendAPI();
  const response = await api.chatsControllerCreateDirectChat(payload);
  return response.data;
};
