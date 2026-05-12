import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "../types";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
  dict?: any;
}

export function PaymentStatusBadge({ status, className, dict }: PaymentStatusBadgeProps) {
  const variants: Record<PaymentStatus, string> = {
    PENDING: "bg-slate-100/80 text-slate-700 hover:bg-slate-100 border-slate-200/60",
    UNDER_REVIEW: "bg-amber-100/80 text-amber-700 hover:bg-amber-100 border-amber-200/60",
    VERIFIED: "bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100 border-emerald-200/60",
    REJECTED: "bg-rose-100/80 text-rose-700 hover:bg-rose-100 border-rose-200/60",
    CANCELLED: "bg-gray-100/80 text-gray-700 hover:bg-gray-100 border-gray-200/60",
  };

  const defaultLabels: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };

  const displayLabel = dict?.status?.[status] || defaultLabels[status] || status;

  return (
    <Badge variant="outline" className={cn("font-medium shadow-none", variants[status], className)}>
      {displayLabel}
    </Badge>
  );
}
