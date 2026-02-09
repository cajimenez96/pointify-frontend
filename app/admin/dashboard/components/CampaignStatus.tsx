/**
 * CampaignStatus - Shows campaign active status and countdown
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Settings } from "@/repositories/admin/settings/types";

interface CampaignStatusProps {
  settings: Settings;
}

function getDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function CampaignStatus({ settings }: CampaignStatusProps) {
  const daysRemaining = getDaysRemaining(settings.campaignEndDate);
  const rewardName = settings.rewards?.find((r) => r.isActive)?.name;

  return (
    <Card className="p-6 md:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Estado de Campaña
          </h3>
          <p className="text-sm text-gray-600 mt-1">{rewardName}</p>
        </div>
        <Badge
          variant={settings.isActive ? "default" : "secondary"}
          className="text-lg px-4 py-2"
        >
          {settings.isActive ? "Activa" : "Inactiva"}
        </Badge>
      </div>

      {daysRemaining !== null && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            {daysRemaining > 0
              ? `Faltan ${daysRemaining} días para finalizar`
              : daysRemaining === 0
                ? "¡Último día de campaña!"
                : "Campaña finalizada"}
          </p>
        </div>
      )}
    </Card>
  );
}
