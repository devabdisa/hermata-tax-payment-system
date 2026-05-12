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

interface SinqeeReceiptPaymentFormProps {
  assessment: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  dict?: any;
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
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Sinqee Bank payments require manual verification by a Kebele worker. 
          Please ensure the uploaded receipt is clear and the reference number is correct.
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
              <CardTitle className="text-xl">Sinqee Bank Receipt</CardTitle>
              <CardDescription>Record a manual bank payment by uploading your receipt</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                <RHFNumberField
                  name="amount"
                  label="Payment Amount (ETB)"
                  disabled
                />
                
                <RHFDatePicker
                  name="paidAt"
                  label="Payment Date (on Receipt)"
                />

                <RHFTextField
                  name="referenceNumber"
                  label="Bank Reference Number"
                  placeholder="Enter the receipt reference number"
                  leftIcon="hash"
                />
              </div>

              <div className="space-y-6">
                <RHFTextField
                  name="bankBranch"
                  label="Bank Branch (Optional)"
                  placeholder="e.g. Hermata Branch"
                  leftIcon="mapPin"
                />

                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-base">Upload Receipt (PDF or Image)</Label>
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
                        <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG or WEBP (Max. 10MB)</p>
                      </div>
                    </label>
                  </div>
                  
                  {errors.file && (
                    <p className="text-sm text-destructive font-medium mt-1">
                      {errors.file.message as string}
                    </p>
                  )}
                  
                  {selectedFile && (
                    <div className="flex items-center gap-3 text-sm bg-primary/5 border border-primary/10 p-3 rounded-lg mt-2 animate-in fade-in slide-in-from-top-1">
                      <div className="p-2 bg-white rounded-md border shadow-sm">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <RHFTextArea
                  name="note"
                  label="Additional Note (Optional)"
                  placeholder="Any additional information about the payment..."
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
                    Submit Receipt
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
