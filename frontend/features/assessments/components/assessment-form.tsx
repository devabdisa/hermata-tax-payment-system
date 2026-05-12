"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssessmentSchema, updateAssessmentSchema } from "../schema";
import { CreateAssessmentInput, UpdateAssessmentInput, TaxAssessment } from "../types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFTextArea from "@/components/forms/RHFTextArea";
import RHFSelect from "@/components/forms/RHFSelect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calculator, Save, Send, ArrowLeft, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { propertiesApi } from "@/features/properties/api";
import { Property } from "@/features/properties/types";
import { taxRatesApi } from "@/features/tax-rates/api";
import { TaxRate } from "@/features/tax-rates/types";
import { AssessmentCalculationCard } from "./assessment-calculation-card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AssessmentFormProps {
  initialData?: TaxAssessment;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

export function AssessmentForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  isEdit = false,
}: AssessmentFormProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTaxRate, setActiveTaxRate] = useState<TaxRate | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const methods = useForm<any>({
    resolver: zodResolver(isEdit ? updateAssessmentSchema : createAssessmentSchema),
    defaultValues: initialData ? {
      penaltyAmount: initialData.penaltyAmount,
      previousBalance: initialData.previousBalance,
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
      note: initialData.note || "",
    } : {
      propertyId: "",
      taxYear: new Date().getFullYear(),
      penaltyAmount: 0,
      previousBalance: 0,
      dueDate: "",
      note: "",
      saveAsDraft: true,
      issueNow: false,
    },
  });

  const { watch, setValue, handleSubmit } = methods;
  const propertyId = watch("propertyId");
  const taxYear = watch("taxYear");
  const penaltyAmount = watch("penaltyAmount") || 0;
  const previousBalance = watch("previousBalance") || 0;

  // Fetch approved properties for selection
  useEffect(() => {
    if (!isEdit) {
      propertiesApi.getProperties({ status: "APPROVED", limit: 100 }).then((res) => {
        setProperties(res.data);
      });
    } else if (initialData?.property) {
      setSelectedProperty(initialData.property as Property);
    }
  }, [isEdit, initialData]);

  // Fetch property details and tax rate when selection or year changes
  useEffect(() => {
    if (propertyId && !isEdit) {
      const prop = properties.find(p => p.id === propertyId);
      if (prop) {
        setSelectedProperty(prop);
        fetchTaxRate(prop.locationCategoryId!, taxYear);
      }
    } else if (isEdit && selectedProperty) {
      fetchTaxRate(selectedProperty.locationCategoryId!, taxYear || initialData?.taxYear);
    }
  }, [propertyId, taxYear, properties, isEdit, selectedProperty]);

  const fetchTaxRate = async (categoryId: string, year: number) => {
    setIsLoadingRates(true);
    try {
      const res = await taxRatesApi.getAll({ 
        locationCategoryId: categoryId, 
        taxYear: year,
        isActive: true 
      });
      if (res.data.length > 0) {
        setActiveTaxRate(res.data[0]);
      } else {
        setActiveTaxRate(null);
      }
    } catch (error) {
      setActiveTaxRate(null);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const calculatePreview = () => {
    if (!selectedProperty || !activeTaxRate) return null;

    const landSize = Number(selectedProperty.landSizeKare);
    const rate = Number(activeTaxRate.ratePerKare);
    const base = landSize * rate;
    const total = base + Number(penaltyAmount) + Number(previousBalance);

    return {
      landSizeKare: landSize,
      ratePerKare: rate,
      baseAmount: base,
      totalAmount: total,
    };
  };

  const preview = calculatePreview();

  const propertyOptions = properties.map((p) => ({
    value: p.id,
    label: `House #${p.houseNumber} / File #${p.fileNumber} - ${p.owner?.fullName}`,
  }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Details</CardTitle>
              <CardDescription>
                {isEdit ? "Update adjustments for this draft assessment." : "Select a property and year to calculate tax."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEdit ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RHFSelect
                    name="propertyId"
                    label="Approved Property"
                    options={propertyOptions}
                    placeholder="Search/Select property"
                  />
                  <RHFTextField
                    name="taxYear"
                    label="Tax Year (Gregorian)"
                    type="number"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Property</p>
                    <p className="font-semibold">House #{selectedProperty?.houseNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Tax Year</p>
                    <p className="font-semibold">{initialData?.taxYear}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RHFTextField
                  name="penaltyAmount"
                  label="Penalty Amount (Optional)"
                  type="number"
                  placeholder="0.00"
                  leftIcon="hash"
                />
                <RHFTextField
                  name="previousBalance"
                  label="Previous Balance (Optional)"
                  type="number"
                  placeholder="0.00"
                  leftIcon="hash"
                />
                <RHFTextField
                  name="dueDate"
                  label="Due Date"
                  type="date"
                />
              </div>

              <RHFTextArea
                name="note"
                label="Assessment Note"
                placeholder="Optional notes for this assessment..."
                isRequired={false}
              />

              {!isEdit && (
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="issueNow" 
                      {...methods.register("issueNow")} 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="issueNow" className="text-sm font-medium">Issue Immediately</label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (!!selectedProperty && !activeTaxRate && !isLoadingRates)}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEdit ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : watch("issueNow") ? "Create & Issue" : "Generate Draft"}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {selectedProperty && (
            <Card className="border-primary/10 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Property Context
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium text-right">{selectedProperty.owner?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Land Size:</span>
                  <span className="font-medium">{selectedProperty.landSizeKare} kare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{selectedProperty.locationCategory?.name}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {preview && (
            <AssessmentCalculationCard
              landSizeKare={preview.landSizeKare}
              ratePerKare={preview.ratePerKare}
              baseAmount={preview.baseAmount}
              penaltyAmount={penaltyAmount}
              previousBalance={previousBalance}
              totalAmount={preview.totalAmount}
              taxYear={isEdit ? initialData?.taxYear! : taxYear}
              locationCategoryName={selectedProperty?.locationCategory?.name}
            />
          )}

          {!activeTaxRate && selectedProperty && !isLoadingRates && (
            <Alert variant="destructive">
              <AlertTitle>Rate Not Found</AlertTitle>
              <AlertDescription className="text-xs">
                No active tax rate found for category "{selectedProperty.locationCategory?.name}" in year {isEdit ? initialData?.taxYear : taxYear}. 
                Please create a tax rate first.
              </AlertDescription>
            </Alert>
          )}

          {isLoadingRates && (
            <div className="flex justify-center p-8 bg-muted/20 rounded-lg animate-pulse">
              <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
