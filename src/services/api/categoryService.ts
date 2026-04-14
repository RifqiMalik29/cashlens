import { type Category } from "@types";

import { api } from "./apiClient";

export interface CategoryResponse {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  is_default: boolean;
  created_at: string;
}

export const categoryService = {
  getCategories: async (): Promise<CategoryResponse[]> => {
    const res = await api.get<{ data: CategoryResponse[] }>(
      "/api/v1/categories"
    );
    return res.data;
  },

  createCategory: async (
    data: Partial<Category>
  ): Promise<CategoryResponse> => {
    const res = await api.post<{ data: CategoryResponse }>(
      "/api/v1/categories",
      {
        name: data.name,
        icon: data.icon,
        color: data.color,
        type: data.type
      }
    );
    return res.data;
  },

  updateCategory: async (
    id: string,
    data: Partial<Category>
  ): Promise<CategoryResponse> => {
    const res = await api.put<Record<string, unknown>>(
      `/api/v1/categories/${id}`,
      data
    );
    // PUT endpoint returns success message, extract data if available
    return (res?.data || res) as CategoryResponse;
  },

  deleteCategory: async (id: string): Promise<void> => {
    return api.delete(`/api/v1/categories/${id}`);
  }
};
