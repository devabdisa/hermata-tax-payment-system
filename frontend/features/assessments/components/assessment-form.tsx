"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssessmentSchema, updateAssessmentSchema } from "../schema";
import { TaxAssessment } from "../types";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/forms/FormProvider";
import RHFTextField from "@/components/forms/RHFTextField";
import RHFTextArea from "@/components/forms/RHFTextArea";
import RHFSelect from "@/components/forms/RHFSelect";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calculator, Save, Info, AlertTriangle } from "lucide-react";
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

  const { watch, handleSubmit } = methods;
  const propertyId = watch("propertyId");
  const taxYear = watch("taxYear");
  const penaltyAmount = watch("penaltyAmount") || 0;
  const previousBalance = watch("previousBalance") || 0;

  useEffect(() => {
    if (!isEdit) {
      propertiesApi.getProperties({ status: "APPROVED", limit: 100 }).then((res) => {
        setProperties(res.data);
      });
    } else if (initialData?.property) {
      setSelectedProperty(initialData.property as Property);
    }
  }, [isEdit, initialData]);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard 
            title="Assessment Configuration" 
            description={isEdit ? "Update adjustments for this draft assessment." : "Select a property and year to calculate tax."}
          >
            <div className="space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Property</p>
                    <p className="font-semibold text-foreground">House #{selectedProperty?.houseNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tax Year</p>
                    <p className="font-semibold text-foreground">{initialData?.taxYear}</p>
                  </div>
                </div>
              )}

              <Separator className="bg-border/50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RHFTextField
                  name="penaltyAmount"
                  label="Penalty Amount (Optional)"
                  type="number"
                  placeholder="0.00"
                />
                <RHFTextField
                  name="previousBalance"
                  label="Previous Balance (Optional)"
                  type="number"
                  placeholder="0.00"
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
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="issueNow" 
                    {...methods.register("issueNow")} 
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="issueNow" className="text-sm font-medium text-foreground">Issue Immediately</label>
                </div>
              )}
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (!!selectedProperty && !activeTaxRate && !isLoadingRates)} className="h-12 px-8 rounded-xl shadow-md">
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
            <Card className="border-primary/10 bg-primary/5 rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="pb-3 border-b border-primary/5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Info className="h-4 w-4" />
                  PROPERTY CONTEXT
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-3 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase tracking-tighter">Owner</span>
                  <span className="font-bold text-foreground text-right">{selectedProperty.owner?.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase tracking-tighter">Land Size</span>
                  <span className="font-bold text-foreground">{selectedProperty.landSizeKare} kare</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase tracking-tighter">Category</span>
                  <span className="font-bold text-foreground">{selectedProperty.locationCategory?.name}</span>
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
            <Alert variant="destructive" className="rounded-2xl shadow-sm border-rose-200 bg-rose-50 dark:bg-rose-950/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Rate Not Found</AlertTitle>
              <AlertDescription className="text-xs font-medium">
                No active tax rate found for category "{selectedProperty.locationCategory?.name}" in year {isEdit ? initialData?.taxYear : taxYear}. 
                Please create a tax rate first.
              </AlertDescription>
            </Alert>
          )}

          {isLoadingRates && (
            <div className="flex justify-center p-8 bg-muted/20 rounded-2xl animate-pulse border border-border/50">
              <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
