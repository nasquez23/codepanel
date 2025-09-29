import { fetcher } from "./api";

export const skillsInterestsApi = {
  getPredefinedSkills: async (): Promise<string[]> => {
    return fetcher(`/api/skills`);
  },

  getPredefinedInterests: async (): Promise<string[]> => {
    return fetcher(`/api/interests`);
  },

  searchSkills: async (query: string): Promise<string[]> => {
    const params = new URLSearchParams();
    if (query) {
      params.append("q", query);
    }

    return fetcher(`/api/skills/search?${params}`);
  },

  searchInterests: async (query: string): Promise<string[]> => {
    const params = new URLSearchParams();
    if (query) {
      params.append("q", query);
    }

    return fetcher(`/api/interests/search?${params}`);
  },
};
