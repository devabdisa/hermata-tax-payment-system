import { Badge } from "@/components/ui/badge";
import { PropertyStatus } from "../types";
import { cn } from "@/lib/utils";

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
  labels?: Record<string, string>;
}

export function PropertyStatusBadge({ status, className, labels }: PropertyStatusBadgeProps) {
  const variants: Record<PropertyStatus, string> = {
    DRAFT: "bg-slate-100/80 text-slate-700 hover:bg-slate-100 border-slate-200/60",
    SUBMITTED: "bg-blue-100/80 text-blue-700 hover:bg-blue-100 border-blue-200/60",
    UNDER_REVIEW: "bg-amber-100/80 text-amber-700 hover:bg-amber-100 border-amber-200/60",
    APPROVED: "bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100 border-emerald-200/60",
    REJECTED: "bg-rose-100/80 text-rose-700 hover:bg-rose-100 border-rose-200/60",
    ARCHIVED: "bg-gray-100/80 text-gray-700 hover:bg-gray-100 border-gray-200/60",
  };

  const defaultLabels: Record<PropertyStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ARCHIVED: "Archived",
  };

  const displayLabel = labels?.[status] || defaultLabels[status] || status;

  return (
    <Badge variant="outline" className={cn("font-medium shadow-none", variants[status], className)}>
      {displayLabel}
    </Badge>
  );
}
