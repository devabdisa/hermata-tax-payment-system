"use client";

import { useEffect, useState } from "react";
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
import { LocationCategory } from "../types";
import { LocationCategoryFormDialog } from "./location-category-form-dialog";
import { locationCategoriesApi } from "../api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface LocationCategoriesTableProps {
  categories: LocationCategory[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function LocationCategoriesTable({ categories, isLoading, onRefresh }: LocationCategoriesTableProps) {
  
  const handleToggleStatus = async (category: LocationCategory) => {
    try {
      if (category.isActive) {
        await locationCategoriesApi.deactivate(category.id!);
        toast.success("Location category deactivated");
      } else {
        await locationCategoriesApi.activate(category.id!);
        toast.success("Location category activated");
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

  if (categories.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">No location categories found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.code}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={category.description}>
                {category.description || "-"}
              </TableCell>
              <TableCell>{category.priority ?? "-"}</TableCell>
              <TableCell>
                {category.isActive ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <LocationCategoryFormDialog
                  category={category}
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
                  onClick={() => handleToggleStatus(category)}
                  title={category.isActive ? "Deactivate" : "Activate"}
                >
                  {category.isActive ? (
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
