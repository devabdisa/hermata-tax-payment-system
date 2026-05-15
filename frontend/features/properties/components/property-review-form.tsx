"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectPropertySchema } from "../schema";
import { RejectPropertyInput } from "../types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextArea from "@/components/forms/RHFTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PropertyReviewFormProps {
  status: string;
  onStartReview: () => void;
  onApprove: () => void;
  onReject: (data: RejectPropertyInput) => void;
  isLoading?: boolean;
  missingCategory?: boolean;
  propertyId?: string;
}

export function PropertyReviewForm({
  status,
  onStartReview,
  onApprove,
  onReject,
  isLoading,
  missingCategory,
  propertyId,
}: PropertyReviewFormProps) {
  const params = useParams();
  const methods = useForm<RejectPropertyInput>({
    resolver: zodResolver(rejectPropertySchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Review Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {status === "SUBMITTED" && (
            <Button onClick={onStartReview} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Start Review
            </Button>
          )}

          {(status === "SUBMITTED" || status === "UNDER_REVIEW") && (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={onApprove} 
                variant="default" 
                className="bg-emerald-600 hover:bg-emerald-700 w-fit"
                disabled={isLoading || missingCategory}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Approve Property
              </Button>
              {missingCategory && (
                <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-md max-w-md">
                  <strong>Cannot Approve:</strong> This property is missing a Location Category. You must{" "}
                  {propertyId ? (
                    <Link href={`/${params.lang || 'en'}/properties/${propertyId}/edit`} className="font-semibold underline hover:text-amber-800">
                      edit the property details
                    </Link>
                  ) : (
                    "edit the property details"
                  )}
                  {" "}to assign a location category before you can approve it.
                </div>
              )}
            </div>
          )}
        </div>

        {(status === "SUBMITTED" || status === "UNDER_REVIEW") && (
          <FormProvider 
            methods={methods} 
            onSubmit={methods.handleSubmit(onReject)}
            className="pt-4 border-t border-primary/10"
          >
            <div className="space-y-4">
              <RHFTextArea
                name="rejectionReason"
                label="Rejection Reason"
                placeholder="Explain why the property is being rejected..."
              />
              <Button 
                type="submit" 
                variant="destructive" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Reject Property
              </Button>
            </div>
          </FormProvider>
        )}

        {status === "APPROVED" && (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">This property has been approved.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
