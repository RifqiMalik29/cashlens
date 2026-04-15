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

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const res = await api.post<AuthData>(
      "/api/v1/auth/login",
      { email, password, language: normalizeLanguage(i18n.language) },
      { isAuth: false }
    );
    // API client auto-unwraps data wrapper
    return res;
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<{ user: BackendUser }> => {
    const res = await api.post<{ user: BackendUser }>(
      "/api/v1/auth/register",
      { email, password, name, language: normalizeLanguage(i18n.language) },
      { isAuth: false }
    );
    return res;
  },

  confirmEmail: async (email: string, otp: string): Promise<void> => {
    await api.post("/api/v1/auth/confirm", { email, otp }, { isAuth: false });
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

  updatePushToken: async (pushToken: string): Promise<void> => {
    await api.patch("/api/v1/auth/push-token", { push_token: pushToken });
  },

  logout: async (refreshToken: string): Promise<void> => {
    return api.post("/api/v1/auth/logout", { refresh_token: refreshToken });
  },

  getMe: async (): Promise<BackendUser> => {
    return await api.get<BackendUser>("/api/v1/auth/me");
  },

  getTelegramStatus: async (): Promise<{
    is_linked: boolean;
    chat_id?: string;
  }> => {
    return await api.get<{ is_linked: boolean; chat_id?: string }>(
      "/api/v1/auth/telegram/status"
    );
  },

  unlinkTelegram: async (): Promise<void> => {
    await api.delete("/api/v1/auth/telegram/status");
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/api/v1/auth/me");
  }
};
