import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProfileAchievements } from "./profile-achievements";
import { useAuth, useMyAchievementsWithProgress } from "@/hooks";
import { useState } from "react";
import { ProfileDetails } from "./profile-details";
import { Card } from "@/components/ui/card";

export function ProfileInfoTabs() {
  const { user } = useAuth();
  const { data: achievements } = useMyAchievementsWithProgress(!!user);
  const [activeTab, setActiveTab] = useState<"details" | "achievements">(
    "details"
  );

  const earnedCount = achievements?.filter((a: any) => a.earnedAt).length || 0;

  return (
    <Card className="px-3 py-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "details" | "achievements")
        }
        className="w-full px-0 sm:px-3"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 px-0">
          <TabsTrigger value="details" className="flex items-center gap-2">
            👤 Profile Details
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

        <TabsContent value="details" className="mt-6">
          <ProfileDetails />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <ProfileAchievements />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
