"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assessmentsApi } from "@/features/assessments/api";
import { paymentsApi } from "../api";
import { SinqeeReceiptPaymentForm } from "./sinqee-receipt-payment-form";
import { ChapaPaymentCard } from "./chapa-payment-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Landmark, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface AssessmentPaymentPageClientProps {
  assessmentId: string;
}

export function AssessmentPaymentPageClient({ assessmentId }: AssessmentPaymentPageClientProps) {
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await assessmentsApi.getAssessment(assessmentId);
        setAssessment(response.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch assessment");
        router.push("/assessments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, router]);

  const handleSinqeeSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await paymentsApi.createSinqeeReceipt(formData);
      toast.success("Payment receipt submitted for review!");
      router.push(`/assessments/${assessmentId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChapaInitiate = async () => {
    setIsSubmitting(true);
    try {
      const response = await paymentsApi.initiateChapa(
        { 
          assessmentId,
          returnUrl: `${window.location.origin}/payments`,
          callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/payments/chapa/webhook`
        }
      );
      
      const { checkoutUrl } = response.data;
      toast.info("Redirecting to Chapa checkout...");
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate Chapa payment");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (assessment?.status === "PAID") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="py-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">Already Paid</h2>
            <p className="text-emerald-800">This assessment has already been fully paid.</p>
            <Button onClick={() => router.push(`/assessments/${assessmentId}`)}>View Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 transition-transform hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total to Pay</p>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(Number(assessment?.totalAmount))}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Select Payment Method</h1>
        <p className="text-muted-foreground text-lg">Choose how you would like to pay for Tax Year {assessment?.taxYear}</p>
      </div>

      <Tabs defaultValue="sinqee" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-16 p-1 bg-slate-100 rounded-xl mb-8">
          <TabsTrigger value="sinqee" className="rounded-lg gap-2 text-base data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
            <Landmark className="h-5 w-5" />
            Sinqee Bank Receipt
          </TabsTrigger>
          <TabsTrigger value="chapa" className="rounded-lg gap-2 text-base data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
            <Zap className="h-5 w-5" />
            Chapa Online
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sinqee" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
          <SinqeeReceiptPaymentForm 
            assessment={assessment} 
            onSubmit={handleSinqeeSubmit}
            isLoading={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="chapa" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="max-w-2xl mx-auto">
            <ChapaPaymentCard 
              assessment={assessment} 
              onInitiate={handleChapaInitiate}
              isLoading={isSubmitting}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
