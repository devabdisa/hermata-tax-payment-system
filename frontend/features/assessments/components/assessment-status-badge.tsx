import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AssessmentStatus } from "../types";

interface AssessmentStatusBadgeProps {
  status: AssessmentStatus;
  className?: string;
}

export function AssessmentStatusBadge({ status, className }: AssessmentStatusBadgeProps) {
  const statusConfig: Record<AssessmentStatus, { label: string; className: string }> = {
    DRAFT: {
      label: "Draft",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
    },
    ISSUED: {
      label: "Issued",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    PAID: {
      label: "Paid",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    },
    OVERDUE: {
      label: "Overdue",
      className: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
