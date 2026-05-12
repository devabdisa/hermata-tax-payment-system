import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Maximize2, Tag, Percent, Plus, Equal } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // Assuming it exists or I'll use a simple formatter

interface AssessmentCalculationCardProps {
  landSizeKare: number | string;
  ratePerKare: number | string;
  baseAmount: number | string;
  penaltyAmount: number | string;
  previousBalance: number | string;
  totalAmount: number | string;
  taxYear: number;
  locationCategoryName?: string;
}

export function AssessmentCalculationCard({
  landSizeKare,
  ratePerKare,
  baseAmount,
  penaltyAmount,
  previousBalance,
  totalAmount,
  taxYear,
  locationCategoryName,
}: AssessmentCalculationCardProps) {
  const format = (val: number | string) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card className="overflow-hidden border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 py-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Calculator className="h-5 w-5" />
          Tax Calculation Summary ({taxYear})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              Land Size
            </p>
            <p className="font-semibold">{landSizeKare} kare</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Location Category
            </p>
            <p className="font-semibold truncate">{locationCategoryName || "N/A"}</p>
          </div>
        </div>

        <Separator className="opacity-50" />

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Percent className="h-3.5 w-3.5" />
              Rate Per Kare
            </span>
            <span className="font-medium">{format(ratePerKare)} ETB</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-muted-foreground font-medium">Base Amount (Size × Rate)</span>
            <span className="font-bold">{format(baseAmount)} ETB</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-muted-foreground flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              Penalty Amount
            </span>
            <span className="text-rose-600 font-medium">+{format(penaltyAmount)} ETB</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-muted-foreground flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              Previous Balance
            </span>
            <span className="text-amber-600 font-medium">+{format(previousBalance)} ETB</span>
          </div>
        </div>

        <div className="pt-4">
          <div className="bg-primary/10 rounded-lg p-4 flex justify-between items-center">
            <span className="text-primary font-bold flex items-center gap-2">
              <Equal className="h-5 w-5" />
              Total Tax Due
            </span>
            <span className="text-2xl font-black text-primary">
              {format(totalAmount)} <span className="text-xs font-normal">ETB</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
