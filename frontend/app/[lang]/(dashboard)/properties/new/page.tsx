"use client";

import { useParams, useRouter } from "next/navigation";
import { PropertyForm } from "@/features/properties/components/property-form";
import { propertiesApi } from "@/features/properties/api";
import { CreatePropertyInput } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function NewPropertyPage() {
  const router = useRouter();
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePropertyInput) => {
    setIsLoading(true);
    try {
      const response = await propertiesApi.createProperty(data);
      toast.success(data.saveAsDraft ? "Property saved as draft" : "Property submitted successfully");
      router.push(`/${lang}/properties/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register Property</h1>
          <p className="text-muted-foreground">
            Submit or register a house/property record for kebele tax processing.
          </p>
        </div>
      </div>

      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} lang={lang as string} />
    </div>
  );
}
