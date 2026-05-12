"use client";

import { useEffect, useState } from "react";
import { propertyOwnersApi } from "../api";
import { PropertyOwner } from "../types";
import { Check, ChevronsUpDown, Loader2, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext, Controller } from "react-hook-form";
import { FormFieldLabel, FormFieldError } from "@/components/forms/form-field-parts";
import { useRouter } from "next/navigation";

interface OwnerSelectorProps {
  name: string;
  label: string;
  lang: string;
  isRequired?: boolean;
}

export function OwnerSelector({ name, label, lang, isRequired = true }: OwnerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, setValue, formState: { errors } } = useFormContext();
  const router = useRouter();

  const error = errors[name];

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      try {
        const response = await propertyOwnersApi.getOwners();
        setOwners(response.data);
      } catch (error) {
        console.error("Failed to fetch owners", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && owners.length === 0) {
      fetchOwners();
    }
  }, [open, owners.length]);

  return (
    <div className="flex flex-col gap-2">
      <FormFieldLabel label={label} isRequired={isRequired} />
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  !field.value && "text-muted-foreground",
                  error && "border-destructive"
                )}
              >
                {field.value
                  ? owners.find((owner) => owner.id === field.value)?.fullName || "Selected Owner"
                  : "Select an owner profile..."}
                {loading ? (
                  <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search owners by name or phone..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="flex flex-col items-center p-4 gap-2">
                      <p className="text-sm text-muted-foreground">No owner profile found.</p>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full"
                        onClick={() => router.push(`/${lang}/property-owners/new`)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Profile
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {owners.map((owner) => (
                      <CommandItem
                        value={owner.fullName + " " + (owner.phone || "")}
                        key={owner.id}
                        onSelect={() => {
                          setValue(name, owner.id, { shouldValidate: true });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            owner.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{owner.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {owner.phone} • {owner.kebeleIdNumber || "No Kebele ID"}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      
      {error && <FormFieldError id={`${name}-error`} message={error.message as string} />}
    </div>
  );
}
