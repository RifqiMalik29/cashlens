import i18n, { normalizeLanguage } from "@services/i18n";

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

interface RegisterResponse {
  message: string;
  data: {
    user: BackendUser;
  };
}

interface ConfirmEmailResponse {
  message: string;
  data: {
    user: BackendUser;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const res = await api.post<AuthResponse | AuthData>(
      "/api/v1/auth/login",
      { email, password, language: normalizeLanguage(i18n.language) },
      { isAuth: false }
    );
    return "data" in res && res.data ? res.data : (res as unknown as AuthData);
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>(
      "/api/v1/auth/register",
      { email, password, name, language: normalizeLanguage(i18n.language) },
      { isAuth: false }
    );
    return res;
  },

  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    const res = await api.get<ConfirmEmailResponse>(
      `/api/v1/auth/confirm?token=${token}`,
      { isAuth: false }
    );
    return res;
  },

  resendConfirmation: async (email: string): Promise<void> => {
    await api.post(
      "/api/v1/auth/resend-confirmation",
      { email },
      { isAuth: false }
    );
  },

  updateLanguage: async (language: string): Promise<void> => {
    await api.patch("/api/v1/auth/language", { language });
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
