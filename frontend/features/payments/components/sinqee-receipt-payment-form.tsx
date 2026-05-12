"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sinqeeReceiptPaymentSchema } from "../schema";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFTextArea from "@/components/forms/RHFTextArea";
import RHFDatePicker from "@/components/forms/RHFDatePicker";
import RHFNumberField from "@/components/forms/RHFNumberField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, FileIcon, Landmark, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { type Dictionary } from "@/lib/get-dictionary";

interface SinqeeReceiptPaymentFormProps {
  assessment: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  dict: Dictionary;
}

export function SinqeeReceiptPaymentForm({
  assessment,
  onSubmit,
  isLoading,
  dict,
}: SinqeeReceiptPaymentFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm<any>({
    resolver: zodResolver(sinqeeReceiptPaymentSchema),
    defaultValues: {
      assessmentId: assessment?.id || "",
      amount: assessment?.totalAmount || 0,
      paidAt: new Date().toISOString().split("T")[0],
      referenceNumber: "",
      bankBranch: "",
      note: "",
    },
  });

  const { handleSubmit, setValue, formState: { errors } } = methods;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", [file], { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("assessmentId", assessment.id);
    formData.append("amount", data.amount.toString());
    formData.append("paidAt", data.paidAt);
    formData.append("referenceNumber", data.referenceNumber);
    if (data.bankBranch) formData.append("bankBranch", data.bankBranch);
    if (data.note) formData.append("note", data.note);
    formData.append("file", selectedFile);

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{dict.confirmations.revocationReason || "Important Note"}</AlertTitle>
        <AlertDescription>
          {dict.confirmations.onlyVerifiedCanReceive} 
          {dict.payments.sinqeeBankReceipt} require manual verification.
        </AlertDescription>
      </Alert>

      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <div className="h-2 bg-orange-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{dict.payments.sinqeeBankReceipt}</CardTitle>
              <CardDescription>{dict.payments.paymentProcessing}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <RHFNumberField
                  name="amount"
                  label={dict.dashboardCards.totalPayments || "Amount"}
                  disabled
                />
                
                <RHFDatePicker
                  name="paidAt"
                  label={dict.payments.paidAt}
                />

                <RHFTextField
                  name="referenceNumber"
                  label={dict.payments.referenceNumber}
                  placeholder="..."
                  leftIcon="hash"
                />
              </div>

              <div className="space-y-6">
                <RHFTextField
                  name="bankBranch"
                  label="Bank Branch"
                  placeholder="..."
                  leftIcon="mapPin"
                />

                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-base">{dict.payments.receiptFile}</Label>
                  <div className="border-2 border-dashed border-muted rounded-xl p-6 transition-colors hover:border-primary/50 group bg-slate-50/50">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
                    >
                      <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700">{dict.common?.search || "Upload"}</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG or WEBP (Max. 10MB)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <RHFTextArea
                  name="note"
                  label="Note"
                  placeholder="..."
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <Button type="submit" size="lg" disabled={isLoading} className="min-w-[200px] h-12 text-base shadow-md transition-all hover:shadow-lg active:scale-95">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    {dict.common?.submit || "Submit"}
                  </>
                )}
              </Button>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
