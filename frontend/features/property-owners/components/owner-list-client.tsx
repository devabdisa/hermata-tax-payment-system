"use client";

import { useEffect, useState } from "react";
import { propertyOwnersApi } from "../api";
import { PropertyOwner } from "../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Plus, 
  Search, 
  User as UserIcon,
  Phone,
  Building,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface OwnerListClientProps {
  lang: string;
  dict: any;
}

export function OwnerListClient({ lang, dict }: OwnerListClientProps) {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await propertyOwnersApi.getOwners({ search });
      setOwners(response.data);
    } catch (error) {
      console.error("Failed to fetch owners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOwners();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone or ID..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push(`/${lang}/property-owners/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Register New Owner
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Identities</TableHead>
              <TableHead className="text-center">Properties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading owners...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : owners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserIcon className="h-12 w-12 opacity-20" />
                    <p>No property owners found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              owners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span>{owner.fullName}</span>
                        {owner.userId && <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0">System User</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{owner.phone}</span>
                      </div>
                      {owner.address && <span className="text-xs text-muted-foreground line-clamp-1">{owner.address}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {owner.nationalId && <div>National: <span className="text-muted-foreground font-mono">{owner.nationalId}</span></div>}
                      {owner.kebeleIdNumber && <div>Kebele: <span className="text-muted-foreground font-mono">{owner.kebeleIdNumber}</span></div>}
                      {!owner.nationalId && !owner.kebeleIdNumber && <span className="text-muted-foreground italic">None recorded</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{owner._count?.properties || 0}</span>
                      <Building className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/${lang}/property-owners/${owner.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
