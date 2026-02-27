"use client";

import { ReactNode } from "react";
import { useForm, Path, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ============================================================================
// TYPES
// ============================================================================

interface LoginField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder: string;
  autoFocus?: boolean;
}

interface LoginFormProps<T extends FieldValues> {
  /** Form validation schema */
  schema: ZodType<T>;
  /** Field definitions in render order */
  fields: LoginField<T>[];
  /** Called with validated form data */
  onSubmit: (data: T) => void;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Header icon element */
  icon: ReactNode;
  /** Main heading text */
  title: string;
  /** Subtitle text below the heading */
  subtitle: string;
  /** Optional footer content (e.g., back link) */
  footer?: ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function LoginForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  isSubmitting,
  icon,
  title,
  subtitle,
  footer,
}: LoginFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-primary p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-2">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={String(field.name)} className="space-y-1">
                <Input
                  id={String(field.name)}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  className="h-11 rounded-xl"
                  {...register(field.name)}
                  disabled={isSubmitting}
                  autoFocus={field.autoFocus}
                />
                {errors[field.name] && (
                  <p className="text-sm text-destructive px-1">
                    {(errors[field.name] as { message?: string })?.message}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              size="xl"
              className="w-full rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>

        {footer && (
          <CardFooter className="justify-center text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
