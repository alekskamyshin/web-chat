import { getChatBackendAPI } from '@/api/generated';
import { MessageDto } from '@/api/generated/schemas';

export const getMessages = async (chatId: string): Promise<MessageDto[]> => {
  const api = getChatBackendAPI();
  const response = await api.messagesControllerListMessages(chatId);
  return response.data;
};
