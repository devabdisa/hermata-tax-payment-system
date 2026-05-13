"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFTextArea from "@/components/forms/RHFTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { PropertyOwnerFormData } from "../types";
import RHFSelect from "@/components/forms/RHFSelect";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  nationalId: z.string().optional(),
  kebeleIdNumber: z.string().optional(),
  address: z.string().optional(),
});

interface OwnerFormProps {
  initialData?: any;
  onSubmit: (data: PropertyOwnerFormData) => void;
  isLoading?: boolean;
  userOptions?: Array<{ value: string; label: string }>;
  showUserSelector?: boolean;
}

export function OwnerForm({ initialData, onSubmit, isLoading, userOptions = [], showUserSelector = false }: OwnerFormProps) {
  const methods = useForm<PropertyOwnerFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      fullName: "",
      phone: "",
      nationalId: "",
      kebeleIdNumber: "",
      address: "",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider methods={methods}>
      <Card>
        <CardHeader>
          <CardTitle>Owner Identity & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showUserSelector && (
            <RHFSelect
              name="userId"
              label="Linked User Account"
              placeholder="Select user account"
              options={userOptions}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFTextField name="fullName" label="Full Name" placeholder="e.g. Abebe Kebede" leftIcon="user" />
            <RHFTextField name="phone" label="Phone Number" placeholder="e.g. +251911..." leftIcon="phone" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFTextField name="nationalId" label="National ID / Passport" placeholder="e.g. ET-123456" isRequired={false} />
            <RHFTextField name="kebeleIdNumber" label="Kebele ID Number" placeholder="e.g. K-01-987" isRequired={false} />
          </div>

          <RHFTextArea name="address" label="Current Address" placeholder="Detailed residential address..." isRequired={false} />

          <div className="flex justify-end pt-4">
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Owner Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
