"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Power, PowerOff } from "lucide-react";
import { TaxRate } from "../types";
import { TaxRateFormDialog } from "./tax-rate-form-dialog";
import { taxRatesApi } from "../api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface TaxRatesTableProps {
  taxRates: TaxRate[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function TaxRatesTable({ taxRates, isLoading, onRefresh }: TaxRatesTableProps) {
  
  const handleToggleStatus = async (taxRate: TaxRate) => {
    try {
      if (taxRate.isActive) {
        await taxRatesApi.deactivate(taxRate.id!);
        toast.success("Tax rate deactivated");
      } else {
        await taxRatesApi.activate(taxRate.id!);
        toast.success("Tax rate activated");
      }
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to change status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (taxRates.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">No tax rates found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Location Category</TableHead>
            <TableHead>Rate Per Kare</TableHead>
            <TableHead>Penalty Type</TableHead>
            <TableHead>Penalty Value</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxRates.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell className="font-medium">{rate.taxYear}</TableCell>
              <TableCell>{rate.locationCategory?.name || rate.locationCategoryId}</TableCell>
              <TableCell>{rate.ratePerKare}</TableCell>
              <TableCell>{rate.penaltyType || "-"}</TableCell>
              <TableCell>{rate.penaltyValue || "-"}</TableCell>
              <TableCell>{rate.dueDate ? new Date(rate.dueDate).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                {rate.isActive ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <TaxRateFormDialog
                  taxRate={rate}
                  onSuccess={onRefresh}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleToggleStatus(rate)}
                  title={rate.isActive ? "Deactivate" : "Activate"}
                >
                  {rate.isActive ? (
                    <PowerOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Power className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
