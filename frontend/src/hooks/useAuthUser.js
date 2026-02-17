import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};
