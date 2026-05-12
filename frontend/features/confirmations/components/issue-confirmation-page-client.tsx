"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createConfirmationSchema } from "../schema";
import { confirmationsApi } from "../api";
import { paymentsApi } from "@/features/payments/api";
import { Payment } from "@/features/payments/types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextArea from "@/components/forms/RHFTextArea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Search, FileText, User, Home, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function IssueConfirmationPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const methods = useForm({
    resolver: zodResolver(createConfirmationSchema),
    defaultValues: {
      paymentId: "",
      note: "",
    },
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Fetch verified payments that likely don't have confirmations
        const response = await paymentsApi.getMany({
          status: "VERIFIED",
          limit: 100,
          search: searchQuery || undefined
        });
        setPayments(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch verified payments");
      } finally {
        setIsLoadingPayments(false);
      }
    };

    const timer = setTimeout(fetchPayments, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setValue("paymentId", payment.id, { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await confirmationsApi.createConfirmation(data);
      toast.success("Confirmation issued successfully!");
      router.push(`/confirmations/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to issue confirmation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Issue Confirmation</h1>
          <p className="text-muted-foreground text-lg">Select a verified payment to generate an official kebele record.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Selection List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search verified payments..." 
              className="pl-10 h-12 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Verified Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {isLoadingPayments ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
              ) : payments.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground italic">No verified payments found</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {payments.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPayment(p)}
                      className={`w-full text-left p-4 transition-colors hover:bg-slate-50 flex flex-col gap-1 ${selectedPayment?.id === p.id ? "bg-primary/5 border-l-4 border-primary" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-slate-900 text-xs truncate max-w-[150px]">
                          {p.referenceNumber || p.txRef || p.id}
                        </span>
                        <span className="text-[10px] font-black text-primary italic uppercase tracking-tighter">Verified</span>
                      </div>
                      <span className="text-sm font-medium">{p.assessment?.property?.houseNumber || "Unknown House"}</span>
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-xs text-muted-foreground">{p.assessment?.property?.owner?.fullName || "No Owner"}</span>
                         <span className="font-mono font-bold text-emerald-600 text-xs">{formatCurrency(Number(p.amount))}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Form & Preview */}
        <div className="lg:col-span-2">
          {selectedPayment ? (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Card className="border-primary/20 shadow-xl rounded-2xl overflow-hidden">
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      Issue Confirmation for {selectedPayment.assessment?.property?.houseNumber}
                    </CardTitle>
                    <CardDescription>Confirming payment for Tax Year {selectedPayment.assessment?.taxYear}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="h-3 w-3" /> Owner
                        </p>
                        <p className="font-bold text-slate-900 text-sm truncate">{selectedPayment.assessment?.property?.owner?.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Home className="h-3 w-3" /> House #
                        </p>
                        <p className="font-bold text-slate-900 text-sm">{selectedPayment.assessment?.property?.houseNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> Tax Year
                        </p>
                        <p className="font-bold text-slate-900 text-sm italic">{selectedPayment.assessment?.taxYear}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 text-emerald-600">
                          <FileText className="h-3 w-3" /> Amount
                        </p>
                        <p className="font-black text-emerald-600 text-sm">{formatCurrency(Number(selectedPayment.amount))}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 italic">Additional Records</h4>
                      <RHFTextArea 
                        name="note" 
                        label="Official Note (Optional)" 
                        placeholder="Add any internal notes or specific observations regarding this record..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/80 border-t p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground italic">
                       <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                       This will generate a unique record and lock the payment for further confirmations.
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto h-14 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Issue Official Confirmation
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </FormProvider>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-slate-50/30">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300 mb-4">
                  <ArrowLeft className="h-8 w-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest italic">Select a payment from the list</h3>
               <p className="text-sm text-muted-foreground mt-2">Only verified payments are eligible for official confirmation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
