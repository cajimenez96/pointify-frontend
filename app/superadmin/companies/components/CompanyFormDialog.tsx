import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "./CompanyForm";
import { useCreateCompanyMutation } from "../hooks/useCreateCompany";
import { useUpdateCompanyMutation } from "../hooks/useUpdateCompany";
import type { Company } from "@/repositories/superadmin/companies/types";
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
} from "@/repositories/superadmin/companies/types";
import type { CompanyFormData } from "../schemas/company-schema";

interface CompanyFormDialogProps {
  mode: "create" | "edit";
  company?: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CompanyFormDialog({
  mode,
  company,
  open,
  onOpenChange,
  onSuccess,
}: CompanyFormDialogProps) {
  const createMutation = useCreateCompanyMutation();
  const updateMutation = useUpdateCompanyMutation();

  const [defaultValues, setDefaultValues] = useState<Partial<CompanyFormData>>(
    {},
  );

  // Update default values when company changes
  useEffect(() => {
    if (mode === "edit" && company) {
      setDefaultValues({
        companyCode: company.companyCode,
        businessName: company.businessName,
        cuitCuil: company.cuitCuil,
        address: company.address || "",
        contactName: company.contactInfo.name,
        contactPhone: company.contactInfo.phone,
        contactEmail: company.contactInfo.email,
        subscriptionEndDate: company.subscriptionEndDate
          ? new Date(company.subscriptionEndDate).toISOString().split("T")[0]
          : "",
        maxUsers: company.maxUsers || 0,
        maxClients: company.maxClients || 0,
      });
    } else {
      setDefaultValues({});
    }
  }, [mode, company]);

  const handleSubmit = async (data: CompanyFormData) => {
    if (mode === "create") {
      const dto: CreateCompanyDto = {
        companyCode: data.companyCode,
        businessName: data.businessName,
        cuitCuil: data.cuitCuil,
        address: data.address,
        contactInfo: {
          name: data.contactName,
          phone: data.contactPhone,
          email: data.contactEmail,
        },
        subscriptionEndDate: data.subscriptionEndDate || null,
        maxUsers: data.maxUsers || 0,
        maxClients: data.maxClients || 0,
      };

      await createMutation.mutateAsync(dto);
    } else if (mode === "edit" && company) {
      const dto: UpdateCompanyDto = {
        businessName: data.businessName,
        address: data.address,
        contactInfo: {
          name: data.contactName,
          phone: data.contactPhone,
          email: data.contactEmail,
        },
        subscriptionEndDate: data.subscriptionEndDate || null,
        maxUsers: data.maxUsers || 0,
        maxClients: data.maxClients || 0,
      };

      await updateMutation.mutateAsync({ id: company._id, dto });
    }

    onOpenChange(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "create" ? "Crear Nueva Empresa" : "Actualizar Empresa"}
          </DialogTitle>
        </DialogHeader>

        <CompanyForm
          mode={mode}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
