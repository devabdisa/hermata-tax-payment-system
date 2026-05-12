"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPropertySchema } from "../schema";
import { CreatePropertyInput, OwnershipType } from "../types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFSelect from "@/components/forms/RHFSelect";
import RHFTextArea from "@/components/forms/RHFTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { locationCategoriesApi } from "@/features/location-categories/api";
import { LocationCategory } from "@/features/location-categories/types";
import { Loader2, Save, Send } from "lucide-react";

import { OwnerSelector } from "@/features/property-owners/components/owner-selector";

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: CreatePropertyInput) => void;
  isLoading?: boolean;
  isUserRole?: boolean;
  lang: string;
}

export function PropertyForm({
  initialData,
  onSubmit,
  isLoading,
  isUserRole,
  lang,
}: PropertyFormProps) {
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const methods = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: initialData || {
      houseNumber: "",
      fileNumber: "",
      landSizeKare: 0,
      ownershipType: "LEASE" as OwnershipType,
      locationCategoryId: "",
      locationDescription: "",
      saveAsDraft: false,
    },
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await locationCategoriesApi.getAll({ isActive: true });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch location categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const onSaveDraft = (data: CreatePropertyInput) => {
    onSubmit({ ...data, saveAsDraft: true });
  };

  const onFinalSubmit = (data: CreatePropertyInput) => {
    onSubmit({ ...data, saveAsDraft: false });
  };

  const ownershipOptions = [
    { value: "LEASE", label: "Lease" },
    { value: "OLD_POSSESSION", label: "Old Possession" },
    { value: "RENTAL", label: "Rental" },
    { value: "OTHER", label: "Other" },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id as string,
    label: `${cat.name} (${cat.code})`
  }));

  return (
    <FormProvider methods={methods}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RHFTextField
                name="houseNumber"
                label="House Number"
                placeholder="e.g. KE-123"
                leftIcon="building"
              />
              <RHFTextField
                name="fileNumber"
                label="File Number"
                placeholder="e.g. FN-2024-001"
                leftIcon="hash"
              />
              <RHFTextField
                name="landSizeKare"
                label="Land Size (Kare / m²)"
                type="number"
                leftIcon="globe"
              />
              <RHFSelect
                name="ownershipType"
                label="Ownership Type"
                options={ownershipOptions}
                placeholder="Select ownership type"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RHFSelect
                name="locationCategoryId"
                label="Location Category"
                options={categoryOptions}
                placeholder={loadingCategories ? "Loading..." : "Select category"}
                isLoading={loadingCategories}
                isRequired={false}
              />
              <RHFTextArea
                name="locationDescription"
                label="Location Description"
                placeholder="Additional details about the property location..."
                isRequired={false}
              />
              {!isUserRole && (
                <OwnerSelector 
                  name="ownerId" 
                  label="Linked Property Owner" 
                  lang={lang}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/50">
              <p className="text-muted-foreground">
                Document upload functionality will be implemented in the Property Documents module.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supporting evidence like ownership deeds and file references will be required later.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFinalSubmit)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit for Review
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
