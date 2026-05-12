import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DocumentStatus } from "../types";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Pending Review",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
