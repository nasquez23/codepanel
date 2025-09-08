"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab, ProfileAchievementsTab } from "./index";
import { useMyAchievements } from "@/hooks/use-achievements";
import { Badge } from "@/components/ui/badge";

export default function ProfilePageTabs() {
  const { data: achievements } = useMyAchievements();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("info");
  const earnedCount = achievements?.filter((a) => a.earnedAt).length || 0;

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "achievements") {
      setActiveTab("achievements");
    } else {
      setActiveTab("info");
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    if (value === "achievements") {
      params.set("tab", "achievements");
    } else {
      params.delete("tab");
    }
    router.replace(`/profile?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and view your achievements
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center gap-2">
            👤 Profile Info
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            🏆 Achievements
            {earnedCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {earnedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <ProfileInfoTab />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <ProfileAchievementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
