import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, getMe, logout } from "../services/auth.service";

export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user: meQuery.data,
    isLoadingUser: meQuery.isLoading,
    isAuthenticated: meQuery.isSuccess,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.isError,
  };
}
