import { type Category } from "@types";

import { type CategoryResponse, categoryService } from "../categoryService";
import i18n from "../i18n";
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

    return data.map((item: CategoryResponse) => {
      const nameKey = item.name_key ?? null;
      const name = nameKey
        ? i18n.t(`categories.names.${nameKey}`, { defaultValue: item.name })
        : item.name;
      return {
        id: item.id,
        name,
        nameKey,
        icon: item.icon,
        color: item.color,
        isDefault: item.is_default,
        isCustom: !item.is_default,
        type: item.type as Category["type"]
      };
    });
  } catch {
    return [];
  }
}
