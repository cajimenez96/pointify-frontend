import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { useCreateUserMutation } from "../hooks/useCreateUser";
import { useUpdateUserMutation } from "../hooks/useUpdateUser";
import { useCompaniesQuery } from "../../companies/hooks/useCompanies";
import type { UserFormData, UserEditFormData } from "../schemas/user-schema";
import type { UserResponse } from "@/repositories/superadmin/users/types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  userData?: UserResponse;
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  userData,
}: UserFormDialogProps) {
  const [isResetting, setIsResetting] = useState(false);

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useCompaniesQuery({
      page: 1,
      limit: 20,
    });

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  const mutation = mode === "create" ? createMutation : updateMutation;

  useEffect(() => {
    if (mutation.isSuccess && !isResetting) {
      setIsResetting(true);
      const timer = setTimeout(() => {
        onOpenChange(false);
        mutation.reset();
        setIsResetting(false);
        onSuccess?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mutation.isSuccess, mutation, onOpenChange, onSuccess, isResetting]);

  const handleSubmit = async (data: UserFormData | UserEditFormData) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data as UserFormData);
      } else if (mode === "edit" && userData) {
        // Remove empty password from update data
        const updateData = { ...data };
        if (!updateData.password || updateData.password.trim() === "") {
          delete updateData.password;
        }
        await updateMutation.mutateAsync({
          id: userData._id,
          dto: updateData,
        });
      }
    } catch (error) {
      // Error is handled by mutation hooks with toast
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    if (!mutation.isPending) {
      onOpenChange(false);
      mutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {mode === "create" ? "Crear Nuevo Usuario" : "Editar Usuario"}
          </DialogTitle>
        </DialogHeader>

        <UserForm
          companies={companiesData?.data || []}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={mutation.isPending}
          isLoadingCompanies={isLoadingCompanies}
          mode={mode}
          initialData={userData}
        />
      </DialogContent>
    </Dialog>
  );
}
