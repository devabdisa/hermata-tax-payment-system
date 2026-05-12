import { Property } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropertyStatusBadge } from "./property-status-badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  FileText, 
  Home, 
  MapPin, 
  Maximize2, 
  ShieldCheck, 
  User,
  AlertCircle,
  Calculator
} from "lucide-react";

interface PropertyDetailProps {
  property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{property.houseNumber}</h2>
          <p className="text-muted-foreground">File Number: {property.fileNumber}</p>
        </div>
        <PropertyStatusBadge status={property.status} className="px-4 py-1.5 text-sm" />
      </div>

      {property.status === "REJECTED" && property.rejectionReason && (
        <Card className="border-rose-200 bg-rose-50/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-900">Rejection Reason</h4>
                <p className="text-rose-800 mt-1">{property.rejectionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Property Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Maximize2 className="h-4 w-4" />
                  Land Size
                </p>
                <p className="font-medium text-lg">{property.landSizeKare} kare (m²)</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Ownership Type
                </p>
                <Badge variant="secondary" className="capitalize">
                  {property.ownershipType.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Location Category
                </p>
                <p className="font-medium">{property.locationCategory?.name || "Not assigned"}</p>
                {property.locationCategory && (
                  <p className="text-xs text-muted-foreground">Code: {property.locationCategory.code}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Registered Date
                </p>
                <p className="font-medium">{formatDate(property.createdAt)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Location Description
              </p>
              <p className="text-sm bg-muted/30 p-3 rounded-md min-h-[60px]">
                {property.locationDescription || "No additional description provided."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{property.owner?.fullName || "Loading..."}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{property.owner?.phone || "N/A"}</p>
            </div>
            {property.owner?.nationalId && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">National ID</p>
                <p className="font-medium">{property.owner.nationalId}</p>
              </div>
            )}
            <Separator />
            <div className="pt-2">
              <p className="text-xs text-muted-foreground italic">
                Approval and assessment details will appear here once processed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Supporting Documents
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/properties/${property.id}/documents`}>
              Manage Documents
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6 py-2">
            <div className="flex-1 space-y-1">
              <p className="text-sm text-muted-foreground">
                Upload and review ownership deeds, kebele file references, and other supporting evidence.
              </p>
              {property._count?.documents !== undefined && (
                <p className="text-sm font-medium">
                  Current documents: <Badge variant="secondary">{property._count.documents}</Badge>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-foreground">PDF/Images</span>
                <span>Supported</span>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-foreground">Max 10MB</span>
                <span>Per file</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Tax Assessments
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/assessments?propertyId=${property.id}`}>
                View History
              </Link>
            </Button>
            <Button 
              size="sm" 
              asChild 
              disabled={property.status !== "APPROVED"}
              className={property.status !== "APPROVED" ? "opacity-50 pointer-events-none" : ""}
            >
              <Link href={`/assessments/new?propertyId=${property.id}`}>
                Generate Assessment
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6 py-2">
            <div className="flex-1 space-y-1">
              <p className="text-sm text-muted-foreground">
                Manage yearly tax calculations based on the property land size and location category.
              </p>
              {property.status !== "APPROVED" ? (
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Property must be approved before tax assessment can be generated.
                </p>
              ) : (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Property is eligible for tax assessment.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Approval & Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reviewed By</p>
                <p className="font-medium">{property.reviewedBy?.name || "Pending review"}</p>
                {property.reviewedAt && (
                  <p className="text-xs text-muted-foreground">{formatDate(property.reviewedAt)}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Approved By</p>
                <p className="font-medium">{property.approvedBy?.name || "Pending approval"}</p>
                {property.approvedAt && (
                  <p className="text-xs text-muted-foreground">{formatDate(property.approvedAt)}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
