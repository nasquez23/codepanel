import { useQuery } from "@tanstack/react-query";
import { Tag } from "@/types/tags-categories";
import { tagsApi } from "@/services/tags-api";

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (filters: string) => [...tagKeys.lists(), { filters }] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: tagsApi.getAllTags,
  });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagsApi.getTagById(id),
    enabled: !!id,
  });
}

export function useSearchTags(keyword: string) {
  return useQuery({
    queryKey: tagKeys.list(keyword),
    queryFn: () => tagsApi.searchTags(keyword),
    enabled: !!keyword.trim(),
  });
}

