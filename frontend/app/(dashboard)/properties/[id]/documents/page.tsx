"use client";

import { useParams } from "next/navigation";
import { PropertyDocumentsPageClient } from "@/features/property-documents/components/property-documents-page-client";

export default function PropertyDocumentsPage() {
  const params = useParams();
  const id = params.id as string;

  return <PropertyDocumentsPageClient propertyId={id} />;
}
