"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PropertyDetail } from "@/features/properties/components/property-detail";
import { propertiesApi } from "@/features/properties/api";
import { Property } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, ShieldCheck, Send, Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PropertyDetailPage() {
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

  const handleSubmit = async () => {
    setIsActionLoading(true);
    try {
      await propertiesApi.submitProperty(id);
      toast.success("Property submitted for review");
      fetchProperty();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit property");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this property?")) return;
    setIsActionLoading(true);
    try {
      await propertiesApi.archiveProperty(id);
      toast.success("Property archived");
      fetchProperty();
    } catch (error: any) {
      toast.error(error.message || "Failed to archive property");
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${lang}/properties`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Property Details</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {property.status === "DRAFT" || property.status === "REJECTED" ? (
            <Button variant="outline" className="gap-2" onClick={handleSubmit} disabled={isActionLoading}>
              <Send className="h-4 w-4" />
              Submit
            </Button>
          ) : null}
          
          <Button variant="outline" className="gap-2" onClick={() => router.push(`/${lang}/properties/${id}/edit`)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          {(property.status === "SUBMITTED" || property.status === "UNDER_REVIEW") && (
            <Button className="gap-2 bg-primary" onClick={() => router.push(`/${lang}/properties/${id}/review`)}>
              <ShieldCheck className="h-4 w-4" />
              Review
            </Button>
          )}

          {property.status !== "ARCHIVED" && (
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-destructive" onClick={handleArchive} disabled={isActionLoading}>
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      <PropertyDetail property={property} />
    </div>
  );
}
