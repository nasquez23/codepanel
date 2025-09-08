"use client";

import { useState, useEffect } from "react";
import { Achievement } from "@/types/achievement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 transform",
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <Card className="w-80 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  🎉 Achievement Unlocked!
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 hover:bg-yellow-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {achievement.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-orange-600 font-medium">
                    +{achievement.pointsReward} points earned
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.category === "MILESTONE"
                      ? "📈 Milestone"
                      : "🔥 Streak"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AchievementNotificationManagerProps {
  achievements: Achievement[];
  onRemove: (id: string) => void;
}

export function AchievementNotificationManager({
  achievements,
  onRemove,
}: AchievementNotificationManagerProps) {
  return (
    <>
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{
            top: `${16 + index * 100}px`,
          }}
          className="fixed right-4 z-50"
        >
          <AchievementNotification
            achievement={achievement}
            onClose={() => onRemove(achievement.id)}
          />
        </div>
      ))}
    </>
  );
}
