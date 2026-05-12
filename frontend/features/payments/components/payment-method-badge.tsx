import { Badge } from "@/components/ui/badge";
import { PaymentMethod } from "../types";
import { cn } from "@/lib/utils";
import { CreditCard, Landmark, Globe } from "lucide-react";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  className?: string;
  dict?: any;
}

export function PaymentMethodBadge({ method, className, dict }: PaymentMethodBadgeProps) {
  const configs: Record<PaymentMethod, { label: string; icon: any; class: string }> = {
    SINQEE_BANK: { 
      label: dict?.payments?.sinqeeBankReceipt || "Sinqee Bank", 
      icon: Landmark, 
      class: "bg-orange-50 text-orange-700 border-orange-100" 
    },
    CHAPA: { 
      label: dict?.payments?.payWithChapa || "Chapa (Online)", 
      icon: Globe, 
      class: "bg-indigo-50 text-indigo-700 border-indigo-100" 
    },
    ONLINE: { 
      label: dict?.payments?.payOnline || "Online", 
      icon: Globe, 
      class: "bg-blue-50 text-blue-700 border-blue-100" 
    },
    CASH_MANUAL: { 
      label: "Cash", 
      icon: CreditCard, 
      class: "bg-slate-50 text-slate-700 border-slate-100" 
    },
    OTHER: { 
      label: "Other", 
      icon: CreditCard, 
      class: "bg-gray-50 text-gray-700 border-gray-100" 
    },
  };

  const config = configs[method] || configs.OTHER;
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={cn("flex items-center gap-1.5 py-0.5 px-2 font-normal", config.class, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}
