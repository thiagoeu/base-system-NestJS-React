import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, getMe, logout } from "../services/auth.service"; // Importe o serviço de registro
import { create as registerService } from "../services/user.service";
import { useAuthStore } from "../store/useAuthStore";

export function useAuth() {
  const queryClient = useQueryClient();
  const { setAccessToken, logout: clearStore } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // NOVA MUTATION DE REGISTRO
  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: any) =>
      registerService(name, email, password), // Chama aquele serviço que criamos
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearStore();
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });

  return {
    user: meQuery.data,
    isLoadingUser: meQuery.isLoading,
    isAuthenticated: !!meQuery.data,
    isErrorUser: meQuery.isError,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginLoading: loginMutation.isPending,

    // Adicione estes dois para o Registro:
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
  };
}
