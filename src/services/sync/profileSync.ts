import { type UserPreferences } from "@types";

import { authService } from "../api/authService";
import { isValidUserId, type SyncResult } from "./syncUtils";

export async function pushProfile(
  _userId: string,
  _data: Partial<UserPreferences>
): Promise<SyncResult> {
  return { success: true, syncedAt: new Date().toISOString() };
}

export async function pullProfile(
  userId: string
): Promise<UserPreferences | null> {
  if (!isValidUserId(userId)) {
    return null;
  }

  try {
    const data = await authService.getMe();

    // Assuming backend returns preferences nested in user or profile
    // Based on MASTER_ROADMAP: user has preferences
    const prefs = data.preferences;

    const preferences: UserPreferences = {
      baseCurrency: prefs?.base_currency || "IDR",
      theme: (prefs?.theme as UserPreferences["theme"]) || "system",
      language: prefs?.language || "id",
      createdAt: data.created_at || new Date().toISOString()
    };

    return preferences;
  } catch {
    return null;
  }
}
