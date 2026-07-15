"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfileAction, type ActionResult } from "@/lib/account/actions";
import type { Tables } from "@/types/database";

const initialState: ActionResult = {};

export function ProfileForm({ profile }: { profile: Tables<"profiles"> }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ""} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={profile.date_of_birth ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" defaultValue={profile.gender ?? undefined}>
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">{state.success}</p>}

      <Button type="submit" className="rounded-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
