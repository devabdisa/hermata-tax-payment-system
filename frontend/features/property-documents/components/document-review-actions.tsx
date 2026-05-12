"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectDocumentSchema, replaceDocumentSchema } from "../schema";
import { PropertyDocument } from "../types";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Loader2, 
  AlertCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface DocumentReviewActionsProps {
  document: PropertyDocument;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onReplace: (id: string, formData: FormData) => Promise<void>;
  canReview?: boolean;
  canReplace?: boolean;
}

export function DocumentReviewActions({
  document,
  onApprove,
  onReject,
  onReplace,
  canReview,
  canReplace,
}: DocumentReviewActionsProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove(document.id);
      toast.success("Document approved");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason || rejectionReason.length < 3) {
      toast.error("Please provide a valid rejection reason");
      return;
    }
    setIsLoading(true);
    try {
      await onReject(document.id, rejectionReason);
      toast.success("Document rejected");
      setIsRejectOpen(false);
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplace = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await onReplace(document.id, formData);
      toast.success("Document file replaced");
      setIsReplaceOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to replace document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {canReview && document.status !== "APPROVED" && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
          onClick={handleApprove}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          Approve
        </Button>
      )}

      {canReview && document.status !== "REJECTED" && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          onClick={() => setIsRejectOpen(true)}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      )}

      {canReplace && document.status === "REJECTED" && (
        <Button 
          size="sm" 
          variant="default"
          onClick={() => setIsReplaceOpen(true)}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Replace File
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        asChild
      >
        <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
          <FileText className="h-4 w-4 mr-1" />
          View
        </a>
      </Button>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document. The owner will be notified to replace it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea 
                placeholder="e.g. File is blurry, wrong document uploaded, etc." 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Dialog */}
      <Dialog open={isReplaceOpen} onOpenChange={setIsReplaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Document File</DialogTitle>
            <DialogDescription>
              Upload a new file to replace the currently rejected one. This will reset the status to Pending.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 bg-rose-50 p-3 rounded-md text-rose-800 text-sm mb-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>Original Rejection Reason: {document.rejectionReason || "No reason provided"}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="replace-file">New File</Label>
              <Input 
                id="replace-file"
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplaceOpen(false)}>Cancel</Button>
            <Button onClick={handleReplace} disabled={!selectedFile || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Replacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
