import { type Category } from "@types";

import { api } from "./apiClient";

export interface CategoryResponse {
  id: string;
  user_id: string;
  name: string;
  name_key: string | null;
  icon: string;
  color: string;
  type: "income" | "expense";
  is_system: boolean;
  is_default: boolean;
  created_at: string;
}

export const categoryService = {
  getCategories: async (): Promise<CategoryResponse[]> => {
    return api.get<CategoryResponse[]>("/api/v1/categories");
  },

  createCategory: async (
    data: Partial<Category>
  ): Promise<CategoryResponse> => {
    return api.post<CategoryResponse>("/api/v1/categories", {
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type
    });
  },

  updateCategory: async (
    id: string,
    data: Partial<Category>
  ): Promise<CategoryResponse> => {
    return api.put<CategoryResponse>(`/api/v1/categories/${id}`, {
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type
    });
  },

  deleteCategory: async (id: string): Promise<void> => {
    return api.delete(`/api/v1/categories/${id}`);
  }
};
