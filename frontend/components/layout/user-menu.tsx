"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Dictionary } from "@/lib/get-dictionary";
import { Badge } from "@/components/ui/badge";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
  locale: string;
  dict: Dictionary;
}

export function UserMenu({ user, locale, dict }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(`/${locale}/login`);
            router.refresh();
          },
        },
      });
      toast.success(dict.auth.logoutSuccessful);
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
            {user.role && (
              <div className="pt-1">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {(dict.roles as any)[user.role] || user.role}
                </Badge>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/${locale}/my-profile`)} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{dict.auth.myProfile}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/settings`)} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>{dict.common.settings}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{dict.auth.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
