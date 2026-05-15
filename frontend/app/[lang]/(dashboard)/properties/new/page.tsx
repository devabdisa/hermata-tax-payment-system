"use client";

import { useParams, useRouter } from "next/navigation";
import { PropertyForm } from "@/features/properties/components/property-form";
import { propertiesApi } from "@/features/properties/api";
import { CreatePropertyInput } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function NewPropertyPage() {
  const router = useRouter();
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = useSession();

  const handleSubmit = async (data: CreatePropertyInput) => {
    setIsLoading(true);
    try {
      const response = await propertiesApi.createProperty(data);
      toast.success(data.saveAsDraft ? "Property saved as draft. Please upload supporting documents." : "Property registered. Please upload supporting documents.");
      router.push(`/${lang}/properties/${response.data.id}/documents`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  const isWorkerOrAdmin = session?.user && ["ADMIN", "MANAGER", "ASSIGNED_WORKER"].includes((session.user as any).role || "USER");
  const isUserRole = !isWorkerOrAdmin;

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

      {isPending ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} lang={lang as string} isUserRole={isUserRole} />
      )}
    </div>
  );
}

