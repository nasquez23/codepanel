import { Tag, TagStats, CreateTagRequest } from "@/types/tags-categories";
import { axiosInstance } from "./api";

export const tagsApi = {
  getAllTags: async (): Promise<Tag[]> => {
    const response = await axiosInstance.get("/api/tags");
    return response.data;
  },

  getTagById: async (id: string): Promise<Tag> => {
    const response = await axiosInstance.get(`/api/tags/${id}`);
    return response.data;
  },

  searchTags: async (keyword: string): Promise<Tag[]> => {
    const response = await axiosInstance.get(`/api/tags/search`, {
      params: { keyword },
    });
    return response.data;
  },

  createTag: async (request: CreateTagRequest): Promise<Tag> => {
    const response = await axiosInstance.post("/api/tags", request);
    return response.data;
  },

  updateTag: async (id: string, request: CreateTagRequest): Promise<Tag> => {
    const response = await axiosInstance.put(`/api/tags/${id}`, request);
    return response.data;
  },

  deleteTag: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/tags/${id}`);
  },

  getTagStats: async (id: string): Promise<TagStats> => {
    const response = await axiosInstance.get(`/api/tags/${id}/stats`);
    return response.data;
  },
};

