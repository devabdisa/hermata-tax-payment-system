import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AssessmentStatus } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";

interface AssessmentStatusBadgeProps {
  status: AssessmentStatus;
  className?: string;
  dict?: Dictionary;
}

export function AssessmentStatusBadge({ status, className, dict }: AssessmentStatusBadgeProps) {
  const statusStyles: Record<AssessmentStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
    ISSUED: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    PAID: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    OVERDUE: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
    CANCELLED: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
  };

  const displayLabel = (dict?.status as any)?.[status] || status;

  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status], className)}>
      {displayLabel}
    </Badge>
  );
}
