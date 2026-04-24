import { type UserPreferences } from "@types";

import { authService } from "../authService";
import { isValidUserId, type SyncResult } from "./syncUtils";

export async function pushProfile(
  _userId: string,
  _data: Partial<UserPreferences>
): Promise<SyncResult> {
  return { success: true, syncedAt: new Date().toISOString() };
}

export async function pullProfile(
  userId: string
): Promise<Partial<UserPreferences> | null> {
  if (!isValidUserId(userId)) {
    return null;
  }

  try {
    const data = await authService.getMe();

    const preferences: Partial<UserPreferences> = {
      baseCurrency: data.base_currency || "IDR",
      language: data.language || "id",
      createdAt: data.created_at || new Date().toISOString()
    };

    return preferences;
  } catch {
    return null;
  }
}
