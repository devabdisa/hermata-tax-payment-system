"use client";

import { useParams, useRouter } from "next/navigation";
import { OwnerForm } from "@/features/property-owners/components/owner-form";
import { propertyOwnersApi } from "@/features/property-owners/api";
import { PropertyOwnerFormData } from "@/features/property-owners/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { usersApi } from "@/features/users/api";
import { User } from "@/features/users/types";

export default function NewPropertyOwnerPage() {
  const router = useRouter();
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    usersApi.getUsers({ role: "USER", limit: 200 }).then((res) => {
      const options = (res.data || [])
        .filter((u: User) => !u.ownerProfile)
        .map((u: User) => ({ value: u.id, label: `${u.name} (${u.email})` }));
      setUserOptions(options);
    }).catch(() => {
      setUserOptions([]);
    });
  }, []);

  const handleSubmit = async (data: PropertyOwnerFormData) => {
    setIsLoading(true);
    try {
      const response = await propertyOwnersApi.createOwner(data);
      toast.success("Owner profile registered successfully");
      router.push(`/${lang}/property-owners/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to register owner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register Owner</h1>
          <p className="text-muted-foreground">
            Create a new identity profile for a house or property owner.
          </p>
        </div>
      </div>

      <OwnerForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        userOptions={userOptions}
        showUserSelector
      />
    </div>
  );
}
