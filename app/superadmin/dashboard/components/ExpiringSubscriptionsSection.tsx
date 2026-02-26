import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExpiringSubscription } from "@/repositories/superadmin/dashboard/types";

interface ExpiringSubscriptionsSectionProps {
  subscriptions: ExpiringSubscription[];
}

function getUrgencyColor(days: number): string {
  if (days < 7) return "bg-red-100 text-red-700 border-red-200";
  if (days < 15) return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Suscripciones por Vencer
        </h2>
        <Badge variant="outline">
          Próximos 30 días
        </Badge>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            ✅ No hay suscripciones próximas a vencer
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground text-sm font-mono">
                      {subscription.companyCode}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground font-medium truncate">
                      {subscription.businessName}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
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
