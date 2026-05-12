"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyOwnersApi } from "@/features/property-owners/api";
import { PropertyOwner } from "@/features/property-owners/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  Edit2, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  CreditCard,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function OwnerDetailsPage() {
  const { id, lang } = useParams();
  const router = useRouter();
  const [owner, setOwner] = useState<PropertyOwner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await propertyOwnersApi.getOwner(id as string);
        setOwner(response.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch owner details");
        router.push(`/${lang}/property-owners`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOwner();
  }, [id, router, lang]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!owner) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{owner.fullName}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="secondary">ID: {owner.kebeleIdNumber || owner.id.substring(0, 8)}</Badge>
              {owner.userId && <Badge variant="outline">System Account Linked</Badge>}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${lang}/property-owners/${owner.id}/edit`)}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{owner.phone}</span>
              </div>
              {owner.user?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{owner.user.email}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{owner.address || "No address recorded"}</span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Identifications</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">National ID</span>
                  <span className="font-mono">{owner.nationalId || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kebele ID</span>
                  <span className="font-mono">{owner.kebeleIdNumber || "—"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties & Activity */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Registered Properties</CardTitle>
                <CardDescription>Houses and land owned by this person.</CardDescription>
              </div>
              <Button size="sm" onClick={() => router.push(`/${lang}/properties/new?ownerId=${owner.id}`)}>
                <Plus className="mr-2 h-3 w-3" />
                Add Property
              </Button>
            </CardHeader>
            <CardContent>
              {owner.properties && owner.properties.length > 0 ? (
                <div className="divide-y">
                  {owner.properties.map((prop: any) => (
                    <div key={prop.id} className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{prop.houseNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {prop.locationCategory?.name} • {prop.landSizeKare} Kare
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/properties/${prop.id}`)}>
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Building className="h-12 w-12 mx-auto opacity-10" />
                  <p className="text-muted-foreground">No properties registered to this owner yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Payment and assessment history.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center space-y-3">
                <History className="h-12 w-12 mx-auto opacity-10" />
                <p className="text-muted-foreground italic text-sm">Activity log integration pending audit-log module.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
