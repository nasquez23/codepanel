import {
  Category,
  CategoryStats,
  CreateCategoryRequest,
} from "@/types/tags-categories";
import { axiosInstance } from "./api";

export const categoriesApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/api/categories");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/api/categories/${id}`);
    return response.data;
  },

  searchCategories: async (keyword: string): Promise<Category[]> => {
    const response = await axiosInstance.get(`/api/categories/search`, {
      params: { keyword },
    });
    return response.data;
  },

  createCategory: async (request: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post("/api/categories", request);
    return response.data;
  },

  updateCategory: async (
    id: string,
    request: CreateCategoryRequest
  ): Promise<Category> => {
    const response = await axiosInstance.put(`/api/categories/${id}`, request);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },

  getCategoryStats: async (id: string): Promise<CategoryStats> => {
    const response = await axiosInstance.get(`/api/categories/${id}/stats`);
    return response.data;
  },
};
