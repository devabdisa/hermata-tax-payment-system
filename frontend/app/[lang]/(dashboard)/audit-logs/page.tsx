import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function AuditLogsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.common.auditLogs}</CardTitle>
          <CardDescription>
            View and track system activity logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[450px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground">{dict.common.auditLogs} Module</h3>
              <p className="text-sm text-muted-foreground">Activity history will be displayed here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
