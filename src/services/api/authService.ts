import { api } from "./apiClient";

export interface BackendUser {
  id: string;
  email: string;
  name?: string;
  telegram_chat_id?: string | number;
  preferences?: {
    base_currency?: string;
    theme?: string;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface AuthData {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

interface AuthResponse {
  data: AuthData;
}

interface MeResponse {
  data: BackendUser;
}

interface TelegramStatusResponse {
  data: {
    is_linked: boolean;
    chat_id?: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const res = await api.post<AuthResponse | AuthData>(
      "/api/v1/auth/login",
      { email, password },
      { isAuth: false }
    );
    return "data" in res && res.data ? res.data : (res as unknown as AuthData);
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthData> => {
    const res = await api.post<AuthResponse | AuthData>(
      "/api/v1/auth/register",
      { email, password, name },
      { isAuth: false }
    );
    return "data" in res && res.data ? res.data : (res as unknown as AuthData);
  },

  logout: async (refreshToken: string): Promise<void> => {
    return api.post("/api/v1/auth/logout", { refresh_token: refreshToken });
  },

  getMe: async (): Promise<BackendUser> => {
    const res = await api.get<MeResponse>("/api/v1/auth/me");
    return res.data;
  },

  getTelegramStatus: async (): Promise<{
    is_linked: boolean;
    chat_id?: string;
  }> => {
    const res = await api.get<TelegramStatusResponse>(
      "/api/v1/auth/telegram/status"
    );
    return res.data;
  },

  unlinkTelegram: async (): Promise<void> => {
    await api.delete("/api/v1/auth/telegram/status");
  }
};
