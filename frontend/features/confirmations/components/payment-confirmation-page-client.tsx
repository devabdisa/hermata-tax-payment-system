"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmationsApi } from "@/features/confirmations/api";
import { paymentsApi } from "@/features/payments/api";
import { KebeleConfirmation } from "@/features/confirmations/types";
import { Payment } from "@/features/payments/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { type Dictionary } from "@/lib/get-dictionary";

interface PaymentConfirmationPageClientProps {
  paymentId: string;
  dict: Dictionary;
}

export function PaymentConfirmationPageClient({ paymentId, dict }: PaymentConfirmationPageClientProps) {
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [confirmation, setConfirmation] = useState<KebeleConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentRes, confRes] = await Promise.all([
          paymentsApi.getOne(paymentId),
          confirmationsApi.getConfirmationByPayment(paymentId).catch(() => ({ data: null })),
        ]);
        
        setPayment(paymentRes.data);
        setConfirmation(confRes?.data || null);
      } catch (error: any) {
        toast.error("Failed to load payment or confirmation data");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paymentId]);

  const handleIssue = async () => {
    setIsIssuing(true);
    try {
      const response = await confirmationsApi.createConfirmation({ paymentId });
      toast.success("Confirmation issued successfully!");
      router.push(`/confirmations/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to issue confirmation");
    } finally {
      setIsIssuing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!payment) return null;

  const isVerified = payment.status === "VERIFIED";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> {dict.common.back}
      </Button>

      {confirmation ? (
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-10">
            <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-black text-emerald-900 uppercase italic">{dict.confirmations.officialConfirmation} {dict.status.ISSUED}</CardTitle>
            <CardDescription className="text-emerald-700 text-lg">
              {dict.confirmations.officialRecordText}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.confirmations.confirmationNumber}</p>
                  <p className="font-mono font-bold text-xl text-primary">{confirmation.confirmationNumber}</p>
                </div>
                <Button onClick={() => router.push(`/confirmations/${confirmation.id}`)} size="lg" className="rounded-xl shadow-md">
                   <FileText className="mr-2 h-5 w-5" />
                   {dict.common.details}
                </Button>
             </div>
          </CardContent>
        </Card>
      ) : isVerified ? (
        <Card className="border-primary/20 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
           <div className="h-3 bg-primary" />
           <CardHeader className="p-10">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                   <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                   <CardTitle className="text-3xl font-black text-slate-900 uppercase italic">{dict.confirmations.issueConfirmation}</CardTitle>
                   <CardDescription className="text-lg">{dict.confirmations.onlyVerifiedCanReceive}</CardDescription>
                </div>
             </div>
           </CardHeader>
           <CardContent className="p-10 pt-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.common.properties}</h4>
                    <div className="space-y-2">
                       <p className="font-bold text-slate-900">{payment.assessment?.property?.houseNumber}</p>
                       <p className="text-sm text-muted-foreground">{payment.assessment?.property?.owner?.fullName}</p>
                       <p className="text-xs text-muted-foreground uppercase tracking-tighter">File: {payment.assessment?.property?.fileNumber}</p>
                    </div>
                 </div>
                 <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-right">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.dashboardCards.totalPayments}</h4>
                    <div className="space-y-2">
                       <p className="text-2xl font-black italic text-emerald-600">{formatCurrency(Number(payment.amount))}</p>
                       <p className="text-sm text-slate-700 font-bold italic">FY {payment.assessment?.taxYear}</p>
                       <p className="text-xs text-muted-foreground truncate">{payment.referenceNumber || payment.txRef}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 text-amber-800">
                 <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                 <div className="space-y-1">
                    <p className="font-bold uppercase text-xs tracking-wider">Official Action Required</p>
                    <p className="text-sm">Issuing this confirmation will mark the payment process as complete. This action cannot be easily undone without administrative privileges.</p>
                 </div>
              </div>
           </CardContent>
           <CardFooter className="p-10 pt-0 flex justify-end gap-4">
              <Button variant="ghost" onClick={() => router.back()} disabled={isIssuing} className="h-14 px-8 rounded-xl">{dict.common.cancel}</Button>
              <Button 
                onClick={handleIssue} 
                disabled={isIssuing} 
                className="h-14 px-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl transition-all hover:scale-[1.02]"
              >
                {isIssuing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                {dict.confirmations.issueConfirmation}
              </Button>
           </CardFooter>
        </Card>
      ) : (
        <Card className="border-rose-100 bg-rose-50/30 rounded-2xl overflow-hidden text-center p-12">
           <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8" />
           </div>
           <h3 className="text-2xl font-black text-rose-900 uppercase italic mb-2">Verification Required</h3>
           <p className="text-rose-800 text-lg mb-8 max-w-md mx-auto">
             Only payments with <span className="font-bold">VERIFIED</span> status can receive kebele confirmation. This payment is currently <span className="font-bold uppercase underline decoration-2">{(dict.status as any)?.[payment.status] || payment.status}</span>.
           </p>
           <Button variant="outline" onClick={() => router.push(`/payments/${paymentId}`)} className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50">
              Return to Payment Review
           </Button>
        </Card>
      )}
    </div>
  );
}
