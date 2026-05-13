"use client";

import { useState, useEffect } from "react";
import { paymentsApi } from "../api";
import { Payment, PaymentStatus, PaymentMethod } from "../types";
import { PaymentsTable } from "./payments-table";
import { toast } from "sonner";
import { type Dictionary } from "@/lib/get-dictionary";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { CreditCard, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface PaymentsPageClientProps {
  dict: Dictionary;
}

export function PaymentsPageClient({ dict }: PaymentsPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "">("");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await paymentsApi.getMany({
        page: currentPage,
        search,
        status: statusFilter || undefined,
        method: methodFilter || undefined,
      });
      setData(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, search, statusFilter, methodFilter]);

  return (
    <PageShell>
      <PageHeader
        title={dict.payments.title}
        description={dict.payments.paymentProcessing || "Track tax payments and verify transactions."}
        icon={CreditCard}
        breadcrumbs={[
          { label: dict.common.dashboard, href: `/${lang}/dashboard` },
          { label: dict.payments.title, href: `/${lang}/payments` }
        ]}
        actions={[
          {
            label: "Refresh",
            onClick: fetchPayments,
            icon: RefreshCw,
            variant: "outline",
            loading: isLoading
          }
        ]}
      />

      <PaymentsTable
        data={data}
        meta={meta}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        onView={(row) => router.push(`/${lang}/payments/${row.id}`)}
        dict={dict}
      />
    </PageShell>
  );
}
