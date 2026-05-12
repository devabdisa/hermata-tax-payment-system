"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { propertyDocumentsApi } from "../api";
import { PropertyDocument, DocumentStatus } from "../types";
import { DocumentUploadForm } from "./document-upload-form";
import { PropertyDocumentsTable } from "./property-documents-table";
import { propertiesApi } from "@/features/properties/api";
import { Property } from "@/features/properties/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Home, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PropertyStatusBadge } from "@/features/properties/components/property-status-badge";

interface PropertyDocumentsPageClientProps {
  propertyId: string;
}

export function PropertyDocumentsPageClient({ propertyId }: PropertyDocumentsPageClientProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setIsLoadingProperty(true);
    try {
      const response = await propertiesApi.getProperty(propertyId);
      setProperty(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch property details");
      router.push("/properties");
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const response = await propertyDocumentsApi.getDocuments({
        propertyId,
        page: currentPage,
        search,
      });
      setDocuments(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch documents");
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  useEffect(() => {
    fetchDocuments();
  }, [propertyId, currentPage, search]);

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true);
    try {
      await propertyDocumentsApi.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await propertyDocumentsApi.approveDocument(id);
    fetchDocuments();
  };

  const handleReject = async (id: string, reason: string) => {
    await propertyDocumentsApi.rejectDocument(id, { rejectionReason: reason });
    fetchDocuments();
  };

  const handleReplace = async (id: string, formData: FormData) => {
    await propertyDocumentsApi.replaceDocument(id, formData);
    fetchDocuments();
  };

  if (isLoadingProperty) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/properties/${propertyId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Property Documents</h1>
          <p className="text-muted-foreground">
            Supporting evidence for House #{property.houseNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-primary/5 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Home className="h-4 w-4" />
                Property Info
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">House Number:</span>
                  <span className="font-medium">{property.houseNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">File Number:</span>
                  <span className="font-medium">{property.fileNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <PropertyStatusBadge status={property.status} />
                </div>
              </div>
              <hr className="border-primary/10" />
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="h-4 w-4" />
                Owner Info
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{property.owner?.fullName}</p>
                <p className="text-xs text-muted-foreground">{property.owner?.phone}</p>
              </div>
            </CardContent>
          </Card>

          <DocumentUploadForm 
            propertyId={propertyId} 
            onSubmit={handleUpload} 
            isLoading={isUploading} 
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <PropertyDocumentsTable 
            documents={documents}
            isLoading={isLoadingDocuments}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onSearch={setSearch}
            onApprove={handleApprove}
            onReject={handleReject}
            onReplace={handleReplace}
            canReview={true} // TODO: Add actual permission check
            canReplace={true} // TODO: Add actual permission check
          />
        </div>
      </div>
    </div>
  );
}
