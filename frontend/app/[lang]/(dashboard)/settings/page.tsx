import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { getServerSession } from "@/lib/auth-helper";
import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/config/permissions";
import { AccessDenied } from "@/components/auth/access-denied";

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const session = await getServerSession();
  const role = (session?.user as any)?.role || "USER";

  if (!hasPermission(role, PERMISSIONS.SETTINGS_MANAGE)) {
    return <AccessDenied dict={dict} lang={lang} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.common.settings}</CardTitle>
          <CardDescription>
            Manage system configurations and regional parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[450px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground">Settings Module</h3>
              <p className="text-sm text-muted-foreground">System-wide configuration options will be available here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
