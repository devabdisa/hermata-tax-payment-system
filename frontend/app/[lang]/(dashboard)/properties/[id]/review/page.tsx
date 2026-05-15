"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PropertyDetail } from "@/features/properties/components/property-detail";
import { PropertyReviewForm } from "@/features/properties/components/property-review-form";
import { propertiesApi } from "@/features/properties/api";
import { Property, RejectPropertyInput } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReviewPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const lang = params.lang as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchProperty = async () => {
    setIsLoading(true);
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

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const handleStartReview = async () => {
    setIsActionLoading(true);
    try {
      await propertiesApi.startReviewProperty(id);
      toast.success("Property review started");
      fetchProperty();
    } catch (error: any) {
      toast.error(error.message || "Failed to start review");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsActionLoading(true);
    try {
      await propertiesApi.approveProperty(id);
      toast.success("Property approved successfully");
      router.push(`/${lang}/properties/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve property");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (data: RejectPropertyInput) => {
    setIsActionLoading(true);
    try {
      await propertiesApi.rejectProperty(id, data);
      toast.success("Property rejected with feedback");
      router.push(`/${lang}/properties/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject property");
    } finally {
      setIsActionLoading(false);
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Property</h1>
          <p className="text-muted-foreground">
            Evaluate property submission and decide on approval or rejection.
          </p>
        </div>
      </div>

      <PropertyReviewForm 
        status={property.status}
        onStartReview={handleStartReview}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isActionLoading}
        missingCategory={!property.locationCategoryId}
        propertyId={id}
      />

      <Separator />
      
      <div className="bg-muted/10 p-6 rounded-xl border border-border/50">
        <h3 className="text-lg font-semibold mb-4">Submission Details</h3>
        <PropertyDetail property={property} />
      </div>
    </div>
  );
}

import { Separator } from "@/components/ui/separator";
