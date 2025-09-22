import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  valueColor: string;
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  valueColor,
}: DashboardStatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4 px-5 py-1">
        <div className="flex flex-col grow gap-2">
          <p className="text-lg font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        {icon}
      </div>
    </Card>
  );
}
