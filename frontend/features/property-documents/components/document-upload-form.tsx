"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadDocumentSchema } from "../schema";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFTextArea from "@/components/forms/RHFTextArea";
import RHFSelect from "@/components/forms/RHFSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, FileIcon } from "lucide-react";
import { useState } from "react";

interface DocumentUploadFormProps {
  propertyId: string;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function DocumentUploadForm({
  propertyId,
  onSubmit,
  isLoading,
}: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm<any>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      title: "",
      documentType: "",
      note: "",
    },
  });

  const { handleSubmit, reset, setValue, formState: { errors } } = methods;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file, { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("title", data.title);
    if (data.documentType) formData.append("documentType", data.documentType);
    if (data.note) formData.append("note", data.note);
    formData.append("file", selectedFile);

    await onSubmit(formData);
    reset();
    setSelectedFile(null);
  };

  const documentTypeOptions = [
    { value: "OWNERSHIP_EVIDENCE", label: "Ownership Evidence (Deed/Liz)" },
    { value: "KEBELE_FILE_REF", label: "Kebele File Reference" },
    { value: "HOUSE_NUMBER_EVIDENCE", label: "House Number Evidence" },
    { value: "NATIONAL_ID", label: "National ID / Kebele ID" },
    { value: "OLD_POSSESSION", label: "Old Possession Evidence" },
    { value: "OTHER", label: "Other Supporting Document" },
  ];

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload New Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <RHFTextField
                name="title"
                label="Document Title"
                placeholder="e.g. House Ownership Deed"
                leftIcon="hash"
              />
              <RHFSelect
                name="documentType"
                label="Document Type"
                options={documentTypeOptions}
                placeholder="Select document type"
                isRequired={false}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">File (PDF, JPG, PNG)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="cursor-pointer"
                  />
                </div>
                {errors.file && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.file.message as string}
                  </p>
                )}
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
                    <FileIcon className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <RHFTextArea
              name="note"
              label="Additional Note (Optional)"
              placeholder="Provide any context or explanation for this document..."
              isRequired={false}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Document
              </Button>
            </div>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
