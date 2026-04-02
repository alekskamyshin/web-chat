import { getChatBackendAPI } from '@/api/generated';

export const getChats = async () => {
  const api = getChatBackendAPI();
  const response = await api.chatsControllerListChats();

  return response.data;
};
