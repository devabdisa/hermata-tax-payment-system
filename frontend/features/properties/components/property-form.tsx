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
import { SectionCard } from "@/components/ui/section-card";
import { useEffect, useState } from "react";
import { locationCategoriesApi } from "@/features/location-categories/api";
import { LocationCategory } from "@/features/location-categories/types";
import { Loader2, Save, Send, Building2, MapPin, FileText } from "lucide-react";

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

  const { handleSubmit } = methods;

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
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard 
            title="Basic Information" 
            description="Core identification and size details for the property."
            className="h-full"
          >
            <div className="space-y-4">
              <RHFTextField
                name="houseNumber"
                label="House Number"
                placeholder="e.g. KE-123"
              />
              <RHFTextField
                name="fileNumber"
                label="File Number"
                placeholder="e.g. FN-2024-001"
              />
              <RHFTextField
                name="landSizeKare"
                label="Land Size (Kare / m²)"
                type="number"
              />
              <RHFSelect
                name="ownershipType"
                label="Ownership Type"
                options={ownershipOptions}
                placeholder="Select ownership type"
              />
            </div>
          </SectionCard>

          <SectionCard 
            title="Location & Owner" 
            description="Geographic details and linked ownership profile."
            className="h-full"
          >
            <div className="space-y-4">
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
            </div>
          </SectionCard>
        </div>

        <SectionCard 
          title="Supporting Documents" 
          description="Manage official documents and ownership proof."
          collapsible
          defaultOpen={false}
        >
          <div className="p-8 border-2 border-dashed rounded-2xl text-center bg-muted/30">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted shadow-sm mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Document Upload</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              You will be automatically redirected to upload supporting documents immediately after saving this property.
            </p>
          </div>
        </SectionCard>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isLoading}
            className="h-12 rounded-xl px-6 border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFinalSubmit)}
            disabled={isLoading}
            className="h-12 rounded-xl px-8 shadow-md"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit for Review
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
