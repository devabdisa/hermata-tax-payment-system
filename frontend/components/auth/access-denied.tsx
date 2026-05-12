"use client";

import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/get-dictionary";

interface AccessDeniedProps {
  dict: Dictionary;
  lang: string;
}

export function AccessDenied({ dict, lang }: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ShieldAlert className="h-16 w-16 text-destructive" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {dict.auth.accessDenied}
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        {dict.auth.noPermission}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.common.back}
        </Button>
        <Button onClick={() => router.push(`/${lang}/dashboard`)}>
          <Home className="mr-2 h-4 w-4" />
          {dict.common.dashboard}
        </Button>
      </div>
    </div>
  );
}
