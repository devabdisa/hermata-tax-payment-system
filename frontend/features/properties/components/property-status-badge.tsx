import { Badge } from "@/components/ui/badge";
import { PropertyStatus } from "../types";
import { cn } from "@/lib/utils";

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function PropertyStatusBadge({ status, className }: PropertyStatusBadgeProps) {
  const variants: Record<PropertyStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
    SUBMITTED: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    UNDER_REVIEW: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
    ARCHIVED: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  };

  const labels: Record<PropertyStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ARCHIVED: "Archived",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", variants[status], className)}>
      {labels[status]}
    </Badge>
  );
}
