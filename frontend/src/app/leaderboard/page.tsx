import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown } from "lucide-react";
import AllTimeLeaderboard from "@/components/leaderboard/all-time-leaderboard";
import WeeklyLeaderboard from "@/components/leaderboard/weekly-leaderboard";
import MonthlyLeaderboard from "@/components/leaderboard/monthly-leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">
          Compete with other users and climb the rankings by solving problems,
          helping others, and contributing to the community.
        </p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Weekly Champions</span>
              </CardTitle>
              <CardDescription>
                Top performers for the current week (Monday to Sunday)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyLeaderboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Medal className="h-5 w-5 text-blue-500" />
                <span>Monthly Leaders</span>
              </CardTitle>
              <CardDescription>
                Top performers for the selected month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyLeaderboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-time">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-500" />
                <span>Hall of Fame</span>
              </CardTitle>
              <CardDescription>
                The ultimate champions with the highest total points earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllTimeLeaderboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
