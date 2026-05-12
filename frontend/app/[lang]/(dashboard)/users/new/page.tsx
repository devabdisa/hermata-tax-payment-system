"use client";

import { useParams, useRouter } from "next/navigation";
import { UserForm } from "@/features/users/components/user-form";
import { usersApi } from "@/features/users/api";
import { UserFormData } from "@/features/users/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function NewUserPage() {
  const router = useRouter();
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await usersApi.createUser(data);
      toast.success("User account created successfully");
      router.push(`/${lang}/users`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create user account");
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
          <h1 className="text-3xl font-bold tracking-tight">Invite Staff</h1>
          <p className="text-muted-foreground">
            Create a new system user account for kebele personnel.
          </p>
        </div>
      </div>

      <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
