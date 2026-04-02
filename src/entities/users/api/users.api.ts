import { getChatBackendAPI } from "@/api/generated";
import { UserSearchResultDto } from "@/api/generated/schemas";

export const searchUsers = async (query: string): Promise<UserSearchResultDto[]> => {
  const api = getChatBackendAPI();
  const response = await api.usersControllerSearchUsers({ q: query, limit: 20 });
  return response.data;
};
