"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taxRateSchema } from "../schema";
import { TaxRate } from "../types";
import { taxRatesApi } from "../api";
import { locationCategoriesApi } from "@/features/location-categories/api";
import { LocationCategory } from "@/features/location-categories/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TaxRateFormDialogProps {
  taxRate?: TaxRate;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function TaxRateFormDialog({ taxRate, onSuccess, trigger }: TaxRateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const isEditing = !!taxRate;

  const form = useForm<TaxRate>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      taxYear: taxRate?.taxYear || new Date().getFullYear(),
      locationCategoryId: taxRate?.locationCategoryId || "",
      ratePerKare: taxRate?.ratePerKare || 0,
      penaltyType: taxRate?.penaltyType || "",
      penaltyValue: taxRate?.penaltyValue || 0,
      dueDate: taxRate?.dueDate ? new Date(taxRate.dueDate).toISOString().split('T')[0] : "",
      isActive: taxRate?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      // Fetch only active categories
      const res = await locationCategoriesApi.getAll({ isActive: true });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load location categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const onSubmit = async (data: TaxRate) => {
    setIsSubmitting(true);
    try {
      if (isEditing && taxRate.id) {
        await taxRatesApi.update(taxRate.id, data);
        toast.success("Tax rate updated successfully");
      } else {
        await taxRatesApi.create(data);
        toast.success("Tax rate created successfully");
      }
      setOpen(false);
      onSuccess();
      if (!isEditing) {
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Tax Rate</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Create"} Tax Rate</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of the tax rate here." 
              : "Add a new official tax rate for a specific location category and year."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="taxYear">Tax Year</Label>
              <Input id="taxYear" type="number" {...form.register("taxYear")} />
              {form.formState.errors.taxYear && (
                <p className="text-sm text-red-500">{form.formState.errors.taxYear.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ratePerKare">Rate Per Kare</Label>
              <Input id="ratePerKare" type="number" step="0.01" {...form.register("ratePerKare")} />
              {form.formState.errors.ratePerKare && (
                <p className="text-sm text-red-500">{form.formState.errors.ratePerKare.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="locationCategoryId">Location Category</Label>
            <Select 
              disabled={isLoadingCategories} 
              value={form.watch("locationCategoryId")} 
              onValueChange={(val: string) => form.setValue("locationCategoryId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id!}>{cat.name} ({cat.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.locationCategoryId && (
              <p className="text-sm text-red-500">{form.formState.errors.locationCategoryId.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="penaltyType">Penalty Type (Opt)</Label>
              <Input id="penaltyType" {...form.register("penaltyType")} placeholder="e.g. FIXED" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="penaltyValue">Penalty Value (Opt)</Label>
              <Input id="penaltyValue" type="number" step="0.01" {...form.register("penaltyValue")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Only active rates will be used for calculations.
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked: boolean) => form.setValue("isActive", checked)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
