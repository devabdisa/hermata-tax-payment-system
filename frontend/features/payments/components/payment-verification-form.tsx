"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectPaymentSchema } from "../schema";
import { Payment } from "../types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextArea from "@/components/forms/RHFTextArea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  Landmark,
  User,
  Calendar,
  Hash
} from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { type Dictionary } from "@/lib/get-dictionary";

interface PaymentVerificationFormProps {
  payment: Payment;
  onVerify: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  isLoading?: boolean;
  dict: Dictionary;
}

export function PaymentVerificationForm({
  payment,
  onVerify,
  onReject,
  isLoading,
  dict,
}: PaymentVerificationFormProps) {
  const [isRejecting, setIsRejecting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(rejectPaymentSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const { handleSubmit } = methods;

  const handleRejectSubmit = async (data: any) => {
    await onReject(data.rejectionReason);
    setIsRejecting(false);
  };

  const isUnderReview = payment.status === "UNDER_REVIEW" || payment.status === "PENDING";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Payment Details & Receipt */}
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-slate-400" />
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {dict.payments.paymentDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-y-6 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5 uppercase text-[10px] font-bold tracking-wider">
                  <Landmark className="h-3 w-3" />
                  Bank Name
                </p>
                <p className="font-semibold text-slate-900">{payment.bankName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5 uppercase text-[10px] font-bold tracking-wider">
                  <Hash className="h-3 w-3" />
                  {dict.payments.referenceNumber}
                </p>
                <p className="font-semibold text-slate-900">{payment.referenceNumber || payment.txRef || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5 uppercase text-[10px] font-bold tracking-wider">
                  <Calendar className="h-3 w-3" />
                  {dict.payments.paidAt}
                </p>
                <p className="font-medium text-slate-900">{payment.paidAt ? formatDate(payment.paidAt) : "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5 uppercase text-[10px] font-bold tracking-wider">
                  <User className="h-3 w-3" />
                  {dict.dashboardCards.totalPayments}
                </p>
                <p className="font-bold text-slate-900">{formatCurrency(Number(payment.amount))}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {dict.payments.receiptFile}
              </p>
              {payment.receiptFileUrl ? (
                <div className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-[4/3] flex items-center justify-center">
                  {payment.receiptFileUrl.match(/\.(pdf)$/i) ? (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">PDF Document</p>
                      <p className="text-xs text-muted-foreground mt-1">{payment.receiptFileName || "Receipt"}</p>
                    </div>
                  ) : (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${payment.receiptFileUrl}`} 
                      alt="Payment Receipt" 
                      className="w-full h-full object-contain"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button variant="secondary" size="sm" asChild>
                      <a href={`${process.env.NEXT_PUBLIC_API_URL}${payment.receiptFileUrl}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {dict.payments.viewReceipt}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-muted-foreground italic">
                   <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                   {dict.payments.receiptFile || "No receipt file"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Actions */}
      <div className="space-y-6">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{dict.payments.paymentVerification}</CardTitle>
            <CardDescription>{dict.payments.paymentProcessing}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isUnderReview ? (
               <div className="bg-slate-50 rounded-xl p-8 text-center space-y-4">
                 <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${payment.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {payment.status === 'VERIFIED' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                 </div>
                 <div className="space-y-1">
                   <h3 className="font-bold text-slate-900 uppercase">{dict.payments.paymentVerification}</h3>
                   <p className="text-sm text-muted-foreground">This payment has already been marked as {payment.status}</p>
                 </div>
                 {payment.status === 'REJECTED' && (
                   <div className="bg-white border border-rose-100 p-3 rounded-lg text-sm text-rose-800 text-left">
                     <p className="font-bold mb-1 uppercase text-[10px]">{dict.confirmations.cancellationReason}:</p>
                     {payment.rejectionReason}
                   </div>
                 )}
               </div>
            ) : !isRejecting ? (
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  onClick={onVerify} 
                  disabled={isLoading} 
                  className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:scale-[1.01]"
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-6 w-6" />}
                  {dict.payments.verifyPayment}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsRejecting(true)} 
                  disabled={isLoading}
                  className="h-14 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  {dict.payments.rejectPayment}
                </Button>
              </div>
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(handleRejectSubmit)}>
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <RHFTextArea
                    name="rejectionReason"
                    label={dict.confirmations.cancellationReason}
                    placeholder="..."
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      variant="destructive" 
                      className="flex-1 h-12"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {dict.payments.rejectPayment}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsRejecting(false)} 
                      disabled={isLoading}
                      className="h-12"
                    >
                      {dict.common?.cancel || "Cancel"}
                    </Button>
                  </div>
                </div>
              </FormProvider>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t p-4 text-[11px] text-muted-foreground flex gap-2">
            <AlertCircle className="h-3.5 w-3.5" />
            {dict.confirmations.officialRecordText}
          </CardFooter>
        </Card>

        {payment.note && (
           <Card className="border-slate-100 bg-slate-50/50">
             <CardHeader className="py-3 px-4">
               <CardTitle className="text-sm font-bold flex items-center gap-2">
                 <AlertCircle className="h-4 w-4 text-slate-500" />
                 Payer Note
               </CardTitle>
             </CardHeader>
             <CardContent className="py-2 px-4 pb-4">
                <p className="text-sm text-slate-600 italic">"{payment.note}"</p>
             </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
}
