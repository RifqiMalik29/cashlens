import { type Category } from "@types";

import { categoryService } from "../api/categoryService";
import { isValidUserId, type SyncResult } from "./syncUtils";

export async function pushCategories(
  _userId: string,
  _categories: Category[]
): Promise<SyncResult> {
  return { success: true, syncedAt: new Date().toISOString() };
}

export async function pullCategories(userId: string): Promise<Category[]> {
  if (!isValidUserId(userId)) return [];

  try {
    const data = await categoryService.getCategories();

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      color: item.color,
      isDefault: item.is_default,
      isCustom: !item.is_default,
      type: item.type as Category["type"]
    }));
  } catch {
    return [];
  }
}
