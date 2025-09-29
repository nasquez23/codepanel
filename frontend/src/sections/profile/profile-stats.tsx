"use client";

import { useProfile, useMyStudentStats, useAuth } from "@/hooks";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileStats() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id || "", !!user);
  const { data: stats, isLoading } = useMyStudentStats(
    profile?.id || "",
    !!user
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!profile || !stats) return null;

  const statItems = [
    {
      label: "Assignments Completed",
      value: stats.totalSubmissions?.toString() || "0",
      color: "text-blue-600",
    },
    {
      label: "Average Grade",
      value: stats.averageGrade ? `${stats.averageGrade.toFixed(1)}%` : "N/A",
      color: "text-green-600",
    },
    {
      label: "Current Streak",
      value: "12 days", // This would need to be added to the API
      color: "text-orange-600",
    },
    {
      label: "Total Points",
      value: stats.totalPoints?.toLocaleString() || "0",
      color: "text-purple-600",
    },
    {
      label: "Problems Posted",
      value: stats.problemsPosted?.toString() || "0",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <Card key={index} className="p-4 text-center">
          <CardContent className="p-0">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
