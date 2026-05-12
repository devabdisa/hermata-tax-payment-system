"use client";

import { KebeleConfirmation } from "../types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ShieldCheck, Landmark, Home, User, Calendar, Hash, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { type Dictionary } from "@/lib/get-dictionary";

interface ConfirmationPrintViewProps {
  confirmation: KebeleConfirmation;
  dict: Dictionary;
}

export function ConfirmationPrintView({ confirmation, dict }: ConfirmationPrintViewProps) {
  const payment = confirmation.payment;
  const assessment = payment?.assessment;
  const property = assessment?.property;
  const owner = property?.owner;

  return (
    <div className="bg-white p-12 max-w-[800px] mx-auto border-2 border-double border-slate-300 relative print:p-0 print:border-0 overflow-hidden">
      {/* Decorative Kebele Stamp/Seal Placeholder */}
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none select-none -rotate-12">
        <div className="border-4 border-emerald-600 rounded-full w-32 h-32 flex items-center justify-center text-emerald-600 font-black text-center text-xs p-2">
          {dict.common.appName?.toUpperCase()}<br/>OFFICIAL SEAL<br/>CONFIRMED
        </div>
      </div>

      <div className="text-center space-y-2 mb-10">
        <h1 className="text-2xl font-black tracking-tight uppercase italic text-slate-900">Hermata Kebele Administration</h1>
        <h2 className="text-lg font-bold text-slate-700 tracking-wider uppercase">{dict.confirmations.officialConfirmation}</h2>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Badge className="bg-emerald-600 text-white border-0 px-4 py-1 uppercase">{dict.status.VERIFIED}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="h-3 w-3" />
              {dict.confirmations.confirmationNumber}
            </p>
            <p className="font-mono text-xl font-black text-primary">{confirmation.confirmationNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {dict.confirmations.issuedAt}
            </p>
            <p className="font-bold text-slate-800">{formatDate(confirmation.issuedAt)}</p>
          </div>
        </div>
        <div className="space-y-4 text-right">
           <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-end">
              <ShieldCheck className="h-3 w-3" />
              Tax Year
            </p>
            <p className="text-xl font-black text-slate-900 italic">FY {assessment?.taxYear}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-end">
              <Landmark className="h-3 w-3" />
              {dict.payments.paymentMethod}
            </p>
            <p className="font-bold text-slate-800">{payment?.method?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Owner Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-slate-100 p-1 rounded text-slate-700">
               <User className="h-3.5 w-3.5" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{dict.common.propertyOwners}</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-5 grid grid-cols-2 gap-4 border border-slate-100 shadow-sm">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Owner Full Name</p>
              <p className="font-bold text-slate-900">{owner?.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Phone Number</p>
              <p className="font-medium text-slate-900">{owner?.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </section>

        {/* Property Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-slate-100 p-1 rounded text-slate-700">
               <Home className="h-3.5 w-3.5" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{dict.common.properties}</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-5 grid grid-cols-3 gap-4 border border-slate-100 shadow-sm">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase">House Number</p>
              <p className="font-bold text-slate-900">{property?.houseNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase">File Number</p>
              <p className="font-bold text-slate-900">{property?.fileNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Land Size (Kare)</p>
              <p className="font-bold text-slate-900">{property?.landSizeKare || "N/A"} m²</p>
            </div>
          </div>
        </section>

        {/* Payment Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-slate-100 p-1 rounded text-slate-700">
               <FileText className="h-3.5 w-3.5" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{dict.payments.paymentDetails}</h3>
          </div>
          <div className="bg-slate-900 rounded-xl p-6 text-white grid grid-cols-2 gap-4 shadow-xl">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{dict.confirmations.officialRecordText}</p>
              <p className="text-2xl font-black italic">{formatCurrency(Number(payment?.amount || 0))}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{dict.payments.referenceNumber}</p>
              <p className="text-lg font-mono font-bold truncate">{payment?.referenceNumber || payment?.txRef || "N/A"}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-end">
        <div className="space-y-4">
           <div className="space-y-1">
             <p className="text-[9px] font-bold text-slate-500 uppercase">Issued By</p>
             <p className="text-sm font-bold text-slate-800">{confirmation.issuedBy?.name || "System"}</p>
           </div>
           <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-2">
             <CheckCircle2 className="h-3.5 w-3.5" />
             {dict.confirmations.officialConfirmation}
           </div>
        </div>
        <div className="text-right space-y-4">
          <div className="w-48 h-0.5 bg-slate-900 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Authorized Signature</p>
          <p className="text-[8px] text-slate-400 max-w-[200px]">
            {dict.confirmations.officialRecordText}
          </p>
        </div>
      </div>
      
      {confirmation.note && (
        <div className="mt-8 p-3 bg-amber-50 rounded-lg border border-amber-100 text-[10px] text-amber-800 italic">
          <strong>Note:</strong> {confirmation.note}
        </div>
      )}
    </div>
  );
}
