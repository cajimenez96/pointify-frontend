"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AdminLoadingProps = {
  title?: string;
  description?: string;
};

export const AdminLoading = ({
  title = "Cargando...",
  description = "Por favor espera un momento.",
}: AdminLoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-[24rem]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
