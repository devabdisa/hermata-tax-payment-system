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

interface PropertyReviewFormProps {
  status: string;
  onStartReview: () => void;
  onApprove: () => void;
  onReject: (data: RejectPropertyInput) => void;
  isLoading?: boolean;
}

export function PropertyReviewForm({
  status,
  onStartReview,
  onApprove,
  onReject,
  isLoading,
}: PropertyReviewFormProps) {
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
            <Button 
              onClick={onApprove} 
              variant="default" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Approve Property
            </Button>
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
