import { useQuery } from "@tanstack/react-query";
import { skillsInterestsApi } from "@/services/skills-interests-api";

export const skillsInterestsKeys = {
  all: ["skills-interests"] as const,
  skills: () => [...skillsInterestsKeys.all, "skills"] as const,
  interests: () => [...skillsInterestsKeys.all, "interests"] as const,
  searchSkills: (query: string) =>
    [...skillsInterestsKeys.all, "search", "skills", query] as const,
  searchInterests: (query: string) =>
    [...skillsInterestsKeys.all, "search", "interests", query] as const,
};

export const useSkills = () => {
  return useQuery({
    queryKey: skillsInterestsKeys.skills(),
    queryFn: skillsInterestsApi.getPredefinedSkills,
    staleTime: 1000 * 60 * 60,
  });
};

export const useInterests = () => {
  return useQuery({
    queryKey: skillsInterestsKeys.interests(),
    queryFn: skillsInterestsApi.getPredefinedInterests,
    staleTime: 1000 * 60 * 60,
  });
};

export const useSkillsSearch = (query: string) => {
  return useQuery({
    queryKey: skillsInterestsKeys.searchSkills(query),
    queryFn: () => skillsInterestsApi.searchSkills(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInterestsSearch = (query: string) => {
  return useQuery({
    queryKey: skillsInterestsKeys.searchInterests(query),
    queryFn: () => skillsInterestsApi.searchInterests(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
