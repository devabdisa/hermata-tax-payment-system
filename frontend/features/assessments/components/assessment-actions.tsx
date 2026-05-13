"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaxAssessment } from "../types";
import { assessmentsApi } from "../api";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Loader2,
  MoreVertical,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AssessmentActionsProps {
  assessment: TaxAssessment;
  onRefresh?: () => void;
  variant?: "inline" | "dropdown";
}

export function AssessmentActions({ assessment, onRefresh, variant = "inline" }: AssessmentActionsProps) {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleIssue = async () => {
    setIsLoading(true);
    try {
      await assessmentsApi.issueAssessment(assessment.id);
      toast.success("Assessment issued successfully");
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to issue assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      await assessmentsApi.recalculateAssessment(assessment.id);
      toast.success("Assessment recalculated");
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to recalculate assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason) {
      toast.error("Please provide a cancellation reason");
      return;
    }
    setIsLoading(true);
    try {
      await assessmentsApi.cancelAssessment(assessment.id, { cancellationReason });
      toast.success("Assessment cancelled");
      setIsCancelOpen(false);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const isDraft = assessment.status === "DRAFT";
  const isIssued = assessment.status === "ISSUED";
  const isCancelled = assessment.status === "CANCELLED";
  const isPaid = assessment.status === "PAID";

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push(`/${lang}/assessments/${assessment.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          
          {isDraft && (
            <>
              <DropdownMenuItem onClick={() => router.push(`/${lang}/assessments/${assessment.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Assessment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRecalculate} disabled={isLoading}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Recalculate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleIssue} className="text-emerald-600 focus:text-emerald-700" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" /> Issue Assessment
              </DropdownMenuItem>
            </>
          )}

          {(isDraft || isIssued) && (
            <DropdownMenuItem 
              onClick={() => setIsCancelOpen(true)} 
              className="text-rose-600 focus:text-rose-700"
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel Assessment
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>

        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Assessment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this assessment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cancellation Reason</Label>
                <Textarea 
                  placeholder="Provide a reason for cancellation..." 
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelOpen(false)}>Back</Button>
              <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => router.push(`/${lang}/assessments/${assessment.id}`)}>
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>
      
      {isDraft && (
        <>
          <Button size="sm" variant="outline" onClick={() => router.push(`/${lang}/assessments/${assessment.id}/edit`)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="default" onClick={handleIssue} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
            Issue
          </Button>
        </>
      )}

      {/* Cancel Action separately triggered by dialog if needed, or just dropdown */}
    </div>
  );
}
