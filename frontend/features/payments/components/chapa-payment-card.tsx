"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Globe, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Dictionary } from "@/lib/get-dictionary";

interface ChapaPaymentCardProps {
  assessment: any;
  onInitiate: () => Promise<void>;
  isLoading?: boolean;
  isConfigured?: boolean;
  dict: Dictionary;
}

export function ChapaPaymentCard({
  assessment,
  onInitiate,
  isLoading,
  isConfigured = true,
  dict,
}: ChapaPaymentCardProps) {
  return (
    <Card className="border-indigo-100 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
          Fastest
        </Badge>
      </div>
      <div className="h-2 bg-indigo-600" />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">{dict.payments.payWithChapa}</CardTitle>
            <CardDescription>Pay instantly using Telebirr, CBEBirr, or Credit Card</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Instant verification</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Secure encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Automatic receipt generation</span>
          </div>
        </div>

        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>
              {dict.payments.chapaNotConfigured}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50/50 border-t pt-6">
        <Button 
          onClick={onInitiate} 
          disabled={isLoading || !isConfigured} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base shadow-md transition-all hover:shadow-lg active:scale-95 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initialising...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5 fill-current transition-transform group-hover:scale-125" />
              {dict.payments.payAssessment}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
