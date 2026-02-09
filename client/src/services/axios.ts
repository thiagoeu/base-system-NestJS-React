import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Extende a configuração do Axios para aceitar uma propriedade customizada "_retry"
// Isso serve para marcar se uma requisição já foi tentada novamente, evitando loops infinitos.
interface AdaptativeAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Cria a instância base do Axios com a URL do seu servidor e permissão para cookies/sessão.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * Roda antes de cada chamada sair para o servidor.
 */
api.interceptors.request.use((config) => {
  // Pega o token atual lá da sua store (Zustand)
  const token = useAuthStore.getState().accessToken;

  // Se existir um token, injeta ele automaticamente no cabeçalho de Autorização
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variáveis de controle para o processo de renovação do token (Refresh)
let isRefreshing = false; // Indica se já existe uma renovação de token em curso
let failedQueue: Array<{
  // Fila para guardar requisições que falharam enquanto o novo token não chega
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

// Função que processa a fila: ou executa as requisições com o novo token, ou cancela todas se der erro.
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * INTERCEPTOR DE RESPOSTA
 * Roda quando o servidor responde (com sucesso ou erro).
 */
api.interceptors.response.use(
  (response) => response, // Se a resposta for 200 (Sucesso), apenas repassa os dados.
  async (error: AxiosError) => {
    const originalRequest = error.config as AdaptativeAxiosRequestConfig;

    // Se o erro NÃO for 401 (Não autorizado), o problema não é token expirado. Repassa o erro.
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    // Verifica se o erro 401 aconteceu justamente na tela de login ou na tentativa de refresh.
    // Se for o caso, não adianta tentar de novo; o usuário precisa logar novamente.
    const isAuthRequest =
      url.includes("/auth/refresh") || url.includes("/auth/login");

    if (isAuthRequest || originalRequest._retry) {
      useAuthStore.getState().logout(); // Limpa a sessão
      return Promise.reject(error);
    }

    // Se já houver um processo de refresh acontecendo, não abre outro.
    // Coloca essa requisição atual em uma "promessa" e joga ela na fila de espera.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          // Quando o token chegar, atualiza o cabeçalho e tenta a chamada original de novo.
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Marca que a renovação começou e ativa a flag de "retry" na chamada original.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Tenta renovar o token chamando a rota de refresh do seu back-end.
      // Usa o 'axios' puro aqui para não passar pelos interceptors e causar loop.
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }, // Importante para enviar o cookie de refresh
      );

      const { accessToken } = data;

      if (!accessToken)
        throw new Error("Refresh failed: No access token returned");

      // Sucesso! Salva o novo token no estado global.
      useAuthStore.getState().setAccessToken(accessToken);

      // Libera todo mundo que estava esperando na fila com o novo token.
      processQueue(null, accessToken);

      // Atualiza a requisição atual que disparou o erro 401 e tenta ela de novo.
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      // Se até o refresh falhou (sessão expirou no servidor), cancela a fila e desloga o usuário.
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      // Reseta a flag para permitir novos refreshs no futuro.
      isRefreshing = false;
    }
  },
);
