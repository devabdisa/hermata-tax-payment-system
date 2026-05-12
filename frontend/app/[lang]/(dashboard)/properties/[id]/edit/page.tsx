"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PropertyForm } from "@/features/properties/components/property-form";
import { propertiesApi } from "@/features/properties/api";
import { UpdatePropertyInput, Property } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const lang = params.lang as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertiesApi.getProperty(id);
        setProperty(response.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch property details");
        router.push(`/${lang}/properties`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id, router, lang]);

  const handleSubmit = async (data: UpdatePropertyInput) => {
    setIsSaving(true);
    try {
      await propertiesApi.updateProperty(id, data);
      toast.success("Property updated successfully");
      router.push(`/${lang}/properties/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">
            Update house/property record details.
          </p>
        </div>
      </div>

      <PropertyForm 
        initialData={property} 
        onSubmit={handleSubmit} 
        isLoading={isSaving} 
        lang={lang}
      />
    </div>
  );
}
