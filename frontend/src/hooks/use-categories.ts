import { categoriesApi } from "@/services/categories-api";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAllCategories(),
  });

  return {
    categories: categories || [],
    isLoading,
    error,
  };
};
