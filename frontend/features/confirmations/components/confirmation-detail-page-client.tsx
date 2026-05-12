"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmationsApi } from "../api";
import { KebeleConfirmation } from "../types";
import { ConfirmationPrintView } from "./confirmation-print-view";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Printer, XCircle, AlertCircle } from "lucide-react";
import { ConfirmationStatusBadge } from "./confirmation-status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type Dictionary } from "@/lib/get-dictionary";

interface ConfirmationDetailPageClientProps {
  confirmationId: string;
  dict: Dictionary;
}

export function ConfirmationDetailPageClient({ confirmationId, dict }: ConfirmationDetailPageClientProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<KebeleConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const fetchConfirmation = async () => {
    try {
      const response = await confirmationsApi.getConfirmation(confirmationId);
      setConfirmation(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch confirmation details");
      router.push("/confirmations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmation();
  }, [confirmationId]);

  const handlePrint = async () => {
    window.print();
    try {
      await confirmationsApi.markAsPrinted(confirmationId);
      fetchConfirmation(); // Update print count
    } catch (error) {
      console.error("Failed to update print count", error);
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsActionLoading(true);
    try {
      await confirmationsApi.cancelConfirmation(confirmationId, { cancellationReason });
      toast.success("Confirmation revoked successfully");
      setShowCancelDialog(false);
      fetchConfirmation();
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke confirmation");
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

  if (!confirmation) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Action Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/confirmations")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {dict.confirmations.title}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">{dict.confirmations.confirmationDetails}</h1>
            <ConfirmationStatusBadge status={confirmation.status} className="h-7 px-3 text-xs" dict={dict} />
          </div>
          {confirmation.status === "CANCELLED" && (
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
               <AlertCircle className="h-4 w-4" />
               {dict.confirmations.revoked}: {confirmation.cancellationReason}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
           {confirmation.status === "ISSUED" && (
             <Button variant="outline" className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => setShowCancelDialog(true)}>
               <XCircle className="h-4 w-4" />
               {dict.common?.revoke || "Revoke"}
             </Button>
           )}
           <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg" onClick={handlePrint}>
             <Printer className="h-4 w-4" />
             {dict.confirmations.printConfirmation}
           </Button>
        </div>
      </div>

      {/* Official Print View */}
      <div className="shadow-2xl rounded-2xl overflow-hidden print:shadow-none">
        <ConfirmationPrintView confirmation={confirmation} dict={dict} />
      </div>

      {/* Revocation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600">{dict.confirmations.revokeConfirmation}</AlertDialogTitle>
            <AlertDialogDescription>
              {dict.confirmations.officialRecordText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">{dict.confirmations.cancellationReason}</Label>
              <Textarea 
                id="reason" 
                placeholder="..." 
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>{dict.common?.cancel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              {dict.common?.revoke || "Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 print:hidden flex items-start gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm text-slate-500">
          <Printer className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">Printing Advice</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For the most professional result, ensure "Background Graphics" is enabled in your browser's print settings. 
            Official kebele stamps should be manually applied after printing if digital signature is not configured.
          </p>
        </div>
      </div>
    </div>
  );
}
