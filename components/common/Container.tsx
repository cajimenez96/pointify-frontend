import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContainerProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Container({
  header,
  footer,
  children,
  className,
}: ContainerProps) {
  return (
    <Card
      className={cn(
        "bg-background rounded-[15px] p-6 shadow-sm border",
        className,
      )}
    >
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </Card>
  );
}
