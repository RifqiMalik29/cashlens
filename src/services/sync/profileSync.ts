import { type UserPreferences } from "@types";

import { supabase } from "../supabase";
import {
  isTableNotFoundError,
  isValidUserId,
  type SyncResult
} from "./syncUtils";

export async function pushProfile(
  userId: string,
  data: Partial<UserPreferences>
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    return { success: false, error: "Invalid user ID" };
  }

  try {
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        base_currency: data.baseCurrency,
        theme: data.theme,
        language: data.language,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "id"
      }
    );

    if (error) throw error;

    return {
      success: true,
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullProfile(
  userId: string
): Promise<UserPreferences | null> {
  if (!isValidUserId(userId)) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      if (isTableNotFoundError(error)) {
        return null;
      }
      throw error;
    }

    const preferences: UserPreferences = {
      baseCurrency: data.base_currency || "IDR",
      theme: data.theme || "system",
      language: data.language || "id",
      createdAt: data.created_at || new Date().toISOString()
    };

    return preferences;
  } catch {
    return null;
  }
}
