import { UserListClient } from "@/features/users/components/user-list-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { getServerSession } from "@/lib/auth-helper";
import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/config/permissions";
import { AccessDenied } from "@/components/auth/access-denied";

export default async function UsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const session = await getServerSession();
  const role = (session?.user as any)?.role || "USER";

  if (!hasPermission(role, PERMISSIONS.USERS_MANAGE)) {
    return <AccessDenied dict={dict} lang={lang} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{dict.common.users}</h1>
        <p className="text-muted-foreground">
          Manage system administrators, managers, and kebele workers.
        </p>
      </div>

      <UserListClient lang={lang} />
    </div>
  );
}
