"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { locationCategorySchema } from "../schema";
import { LocationCategory } from "../types";
import { locationCategoriesApi } from "../api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LocationCategoryFormDialogProps {
  category?: LocationCategory;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function LocationCategoryFormDialog({ category, onSuccess, trigger }: LocationCategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!category;

  const form = useForm<LocationCategory>({
    resolver: zodResolver(locationCategorySchema),
    defaultValues: {
      name: category?.name || "",
      code: category?.code || "",
      description: category?.description || "",
      priority: category?.priority || 0,
      isActive: category?.isActive ?? true,
    },
  });

  const onSubmit = async (data: LocationCategory) => {
    setIsSubmitting(true);
    try {
      if (isEditing && category.id) {
        await locationCategoriesApi.update(category.id, data);
        toast.success("Location category updated successfully");
      } else {
        await locationCategoriesApi.create(data);
        toast.success("Location category created successfully");
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
        {trigger || <Button>Create Category</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Create"} Location Category</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of the location category here." 
              : "Add a new location category for tax assessment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="e.g. Main Road / Commercial" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...form.register("code")} placeholder="e.g. A" className="uppercase" />
            {form.formState.errors.code && (
              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...form.register("description")} placeholder="Details about this location level" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority / Level (Optional)</Label>
            <Input id="priority" type="number" {...form.register("priority")} placeholder="1" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Only active categories can be used for new tax rates.
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
