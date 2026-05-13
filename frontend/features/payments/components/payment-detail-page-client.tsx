"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentsApi } from "../api";
import { Payment } from "../types";
import { PaymentVerificationForm } from "./payment-verification-form";
import { PaymentStatusBadge } from "./payment-status-badge";
import { PaymentMethodBadge } from "./payment-method-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Building2, MapPin, Calculator, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { confirmationsApi } from "@/features/confirmations/api";
import { KebeleConfirmation } from "@/features/confirmations/types";
import { FileText, CheckCircle2 } from "lucide-react";

import { type Dictionary } from "@/lib/get-dictionary";

interface PaymentDetailPageClientProps {
  paymentId: string;
  dict: Dictionary;
}

export function PaymentDetailPageClient({ paymentId, dict }: PaymentDetailPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [payment, setPayment] = useState<Payment | null>(null);
  const [confirmation, setConfirmation] = useState<KebeleConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchPaymentData = async () => {
    try {
      const [paymentRes, confRes] = await Promise.all([
        paymentsApi.getOne(paymentId),
        confirmationsApi.getConfirmationByPayment(paymentId).catch(() => ({ data: null })),
      ]);
      setPayment(paymentRes.data);
      setConfirmation(confRes?.data || null);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch payment details");
      router.push(`/${lang}/payments`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [paymentId]);

  const handleVerify = async () => {
    setIsActionLoading(true);
    try {
      await paymentsApi.verify(paymentId);
      toast.success("Payment verified successfully!");
      fetchPaymentData();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify payment");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsActionLoading(true);
    try {
      await paymentsApi.reject(paymentId, reason);
      toast.success("Payment rejected");
      fetchPaymentData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject payment");
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

  if (!payment) return null;

  const assessment = payment.assessment;
  const property = assessment?.property;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/payments`)} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {dict.common.payments}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">{dict.payments.paymentDetails}</h1>
            <PaymentStatusBadge status={payment.status} className="h-7 px-3 text-xs" dict={dict} />
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            {dict.payments.referenceNumber}: <span className="font-mono text-slate-700 font-bold">{payment.referenceNumber || payment.txRef || payment.id}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
           <div className="text-right">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{dict.dashboardCards.totalPayments}</p>
             <p className="text-2xl font-black text-slate-900">{formatCurrency(Number(payment.amount))}</p>
           </div>
           <Separator orientation="vertical" className="h-10 mx-2" />
           <PaymentMethodBadge method={payment.method} className="h-10 px-4 text-sm" dict={dict} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-slate-50/50 border-slate-200">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{dict.common.properties}</h3>
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                      <Building2 className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">House Number</p>
                      <p className="text-sm font-bold text-slate-900">{property?.houseNumber || "N/A"}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                      <MapPin className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{dict.common.locationCategories}</p>
                      <p className="text-sm font-bold text-slate-900">{property?.locationCategory?.name || "N/A"}</p>
                    </div>
                 </div>
               </div>
            </div>

            <Separator />

            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{dict.common.assessments}</h3>
               <div className="space-y-3">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                      <Calculator className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tax Year</p>
                      <p className="text-sm font-bold text-slate-900">{assessment?.taxYear}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{dict.payments.paymentStatus}</p>
                      <p className="text-sm font-bold text-slate-900 italic uppercase">{(dict.status as any)?.[assessment?.status] || assessment?.status}</p>
                    </div>
                 </div>
               </div>
            </div>

            <Separator />

            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-primary italic">{dict.confirmations.title}</h3>
               {confirmation ? (
                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-3">
                   <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                     <CheckCircle2 className="h-4 w-4" />
                     {dict.confirmations.officialConfirmation}
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.confirmations.confirmationNumber}</p>
                     <p className="font-mono font-bold text-sm text-slate-700">{confirmation.confirmationNumber}</p>
                   </div>
                   <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 rounded-lg"
                    onClick={() => router.push(`/${lang}/confirmations/${confirmation.id}`)}
                   >
                     <FileText className="mr-2 h-3.5 w-3.5" />
                     {dict.confirmations.viewConfirmation}
                   </Button>
                 </div>
               ) : payment.status === "VERIFIED" ? (
                 <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      {dict.confirmations.onlyVerifiedCanReceive}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm rounded-lg"
                      onClick={() => router.push(`/${lang}/payments/${paymentId}/confirmation`)}
                    >
                      <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                      {dict.confirmations.issueConfirmation}
                    </Button>
                 </div>
               ) : (
                 <p className="text-[11px] text-muted-foreground italic bg-slate-100/50 p-3 rounded-lg border border-slate-100">
                    {dict.confirmations.mustBeVerified}
                 </p>
               )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <PaymentVerificationForm 
            payment={payment}
            onVerify={handleVerify}
            onReject={handleReject}
            isLoading={isActionLoading}
            dict={dict}
          />
        </div>
      </div>
    </div>
  );
}
