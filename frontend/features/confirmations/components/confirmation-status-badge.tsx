import { Badge } from "@/components/ui/badge";
import { ConfirmationStatus } from "../types";
import { cn } from "@/lib/utils";

interface ConfirmationStatusBadgeProps {
  status: ConfirmationStatus;
  className?: string;
  dict?: any;
}

export function ConfirmationStatusBadge({ status, className, dict }: ConfirmationStatusBadgeProps) {
  const configs: Record<ConfirmationStatus, { label: string; class: string }> = {
    ISSUED: { 
      label: dict?.status?.ISSUED || "Issued", 
      class: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm" 
    },
    CANCELLED: { 
      label: dict?.status?.CANCELLED || "Cancelled", 
      class: "bg-rose-50 text-rose-700 border-rose-100 shadow-sm" 
    },
  };

  const config = configs[status] || { label: status, class: "bg-slate-50 text-slate-700 border-slate-100" };

  return (
    <Badge variant="outline" className={cn("font-medium px-2.5 py-0.5 rounded-full", config.class, className)}>
      {config.label}
    </Badge>
  );
}
