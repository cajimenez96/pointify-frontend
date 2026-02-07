import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExpiringSubscription } from "@/repositories/superadmin/dashboard/types";

interface ExpiringSubscriptionsSectionProps {
  subscriptions: ExpiringSubscription[];
}

function getUrgencyColor(days: number): string {
  if (days < 7) return "bg-red-500/20 text-red-400 border-red-500/50";
  if (days < 15) return "bg-orange-500/20 text-orange-400 border-orange-500/50";
  return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ExpiringSubscriptionsSection({
  subscriptions,
}: ExpiringSubscriptionsSectionProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Suscripciones por Vencer
        </h2>
        <Badge variant="outline" className="text-slate-400 border-slate-600">
          Próximos 30 días
        </Badge>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">
            ✅ No hay suscripciones próximas a vencer
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-900/70 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-400 text-sm font-mono">
                      {subscription.companyCode}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-white font-medium truncate">
                      {subscription.businessName}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Vence: {formatDate(subscription.subscriptionEndDate)}
                  </p>
                </div>
                <Badge className={getUrgencyColor(subscription.daysRemaining)}>
                  {subscription.daysRemaining === 0
                    ? "Hoy"
                    : subscription.daysRemaining === 1
                      ? "Mañana"
                      : `${subscription.daysRemaining} días`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
