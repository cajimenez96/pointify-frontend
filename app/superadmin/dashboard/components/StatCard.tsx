import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-2xl shrink-0`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
