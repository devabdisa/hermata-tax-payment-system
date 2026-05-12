"use client";

import { TaxAssessment } from "../types";
import { AssessmentStatusBadge } from "./assessment-status-badge";
import { AssessmentCalculationCard } from "./assessment-calculation-card";
import { AssessmentActions } from "./assessment-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Calendar, 
  FileText, 
  Home, 
  MapPin, 
  ShieldCheck, 
  User,
  AlertCircle,
  History,
  Info
} from "lucide-react";

interface AssessmentDetailProps {
  assessment: TaxAssessment;
  onRefresh?: () => void;
}

export function AssessmentDetail({ assessment, onRefresh }: AssessmentDetailProps) {
  const property = assessment.property;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assessment Detail</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Tax Year {assessment.taxYear} • House #{property?.houseNumber}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AssessmentStatusBadge status={assessment.status} className="px-4 py-1.5 text-sm" />
          <AssessmentActions assessment={assessment} onRefresh={onRefresh} />
        </div>
      </div>

      {assessment.status === "CANCELLED" && assessment.cancellationReason && (
        <Alert variant="destructive" className="bg-rose-50 border-rose-200">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <AlertTitle className="text-rose-900 font-bold">Assessment Cancelled</AlertTitle>
          <AlertDescription className="text-rose-800">
            {assessment.cancellationReason}
            <div className="mt-2 text-xs opacity-70">
              Cancelled by {assessment.cancelledBy?.name} on {assessment.cancelledAt ? formatDate(assessment.cancelledAt) : "N/A"}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Property & Owner Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">House Number</p>
                  <p className="font-semibold text-lg">{property?.houseNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">File Number</p>
                  <p className="font-semibold text-lg">{property?.fileNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Owner Name
                  </p>
                  <p className="font-medium">{property?.owner?.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    Location Category
                  </p>
                  <p className="font-medium">{property?.locationCategory?.name}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  Assessment Note
                </p>
                <div className="bg-muted/30 p-3 rounded-md text-sm min-h-[60px]">
                  {assessment.note || "No notes provided for this assessment."}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <History className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="font-medium">{assessment.issuedBy?.name || "Pending"}</p>
                    {assessment.issuedAt && (
                      <p className="text-xs text-muted-foreground">{formatDate(assessment.issuedAt)}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{assessment.dueDate ? formatDate(assessment.dueDate) : "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <AssessmentCalculationCard
            landSizeKare={assessment.landSizeKare}
            ratePerKare={assessment.ratePerKare}
            baseAmount={assessment.baseAmount}
            penaltyAmount={assessment.penaltyAmount}
            previousBalance={assessment.previousBalance}
            totalAmount={assessment.totalAmount}
            taxYear={assessment.taxYear}
            locationCategoryName={property?.locationCategory?.name}
          />

          <Card className="mt-6 border-blue-100 bg-blue-50/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-blue-900">Payment Status</h4>
                  <p className="text-xs text-blue-800">
                    Payment processing and receipt verification via Sinqee Bank will be available in the next module.
                  </p>
                  {assessment.status === "ISSUED" && (
                    <Button variant="outline" size="sm" className="w-full bg-white border-blue-200 text-blue-700" disabled>
                      Record Payment (Coming Soon)
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
