import { type Category } from "@types";

import { supabase } from "../supabase";
import {
  type CategoryRow,
  isTableNotFoundError,
  isValidUserId,
  mapCategoryToDb,
  type SyncResult
} from "./syncUtils";

export async function pushCategories(
  userId: string,
  categories: Category[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    return { success: false, error: "Invalid user ID" };
  }

  try {
    const { error } = await supabase.from("categories").upsert(
      categories.map((c) => ({
        ...mapCategoryToDb(c),
        user_id: userId
      })),
      {
        onConflict: "id,user_id"
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

export async function pullCategories(userId: string): Promise<Category[]> {
  if (!isValidUserId(userId)) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        return [];
      }
      throw error;
    }

    const categories: Category[] = (data || []).map((item: CategoryRow) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      color: item.color,
      isDefault: item.is_default,
      isCustom: item.is_custom,
      type: item.type as Category["type"]
    }));

    return categories;
  } catch {
    return [];
  }
}
