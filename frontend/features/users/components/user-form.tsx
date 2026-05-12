"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFSelect from "@/components/forms/RHFSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { UserFormData, UserRole, UserStatus } from "../types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["ADMIN", "MANAGER", "ASSIGNED_WORKER", "USER"]),
  status: z.enum(["ACTIVE", "SUSPENDED", "DISABLED"]),
});

interface UserFormProps {
  initialData?: any;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const methods = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      email: "",
      role: "ASSIGNED_WORKER",
      status: "ACTIVE",
    },
  });

  const { handleSubmit } = methods;

  const roleOptions = [
    { value: "ADMIN", label: "Administrator" },
    { value: "MANAGER", label: "Manager" },
    { value: "ASSIGNED_WORKER", label: "Kebele Worker" },
    { value: "USER", label: "House Owner (User)" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "DISABLED", label: "Disabled" },
  ];

  return (
    <FormProvider methods={methods}>
      <Card>
        <CardHeader>
          <CardTitle>Staff / User Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFTextField name="name" label="Full Name" placeholder="e.g. John Doe" leftIcon="user" />
            <RHFTextField name="email" label="Email Address" placeholder="e.g. john@example.com" leftIcon="mail" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect name="role" label="System Role" options={roleOptions} />
            <RHFSelect name="status" label="Account Status" options={statusOptions} />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save User Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
