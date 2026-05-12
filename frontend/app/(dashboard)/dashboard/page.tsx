import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, CheckCircle, Calculator, CreditCard, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of Hermata Kebele house tax and property metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assessments Issued</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,450</div>
            <p className="text-xs text-muted-foreground mt-1">For current fiscal year</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M ETB</div>
            <p className="text-xs text-muted-foreground mt-1">+450k this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                <h3 className="text-sm font-medium text-muted-foreground">No recent activity to show</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used shortcuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Home className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium">Register Property</p>
                    <p className="text-xs text-muted-foreground">Add a new house record</p>
                </div>
             </div>
             <div className="flex items-center p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="bg-blue-500/10 p-2 rounded-full mr-4">
                    <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium">Generate Assessment</p>
                    <p className="text-xs text-muted-foreground">Calculate tax for a property</p>
                </div>
             </div>
             <div className="flex items-center p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="bg-emerald-500/10 p-2 rounded-full mr-4">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm font-medium">Verify Payment</p>
                    <p className="text-xs text-muted-foreground">Approve Sinqee bank receipts</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
