import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../api/users.api";

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['userSearch', query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 3,
  });
};
