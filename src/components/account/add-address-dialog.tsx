"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addAddressAction, type ActionResult } from "@/lib/account/actions";

const initialState: ActionResult = {};

export function AddAddressDialog() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<ActionResult>(initialState);
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addAddressAction(initialState, formData);
      setState(result);
      if (result.success) setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setState(initialState);
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="size-4" /> Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a new address</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="type">Address type</Label>
              <Select name="type" defaultValue="shipping">
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="line1">Address line 1</Label>
              <Input id="line1" name="line1" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="line2">Address line 2 (optional)</Label>
              <Input id="line2" name="line2" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" name="postalCode" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="IN" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="landmark">Landmark (optional)</Label>
              <Input id="landmark" name="landmark" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isDefault" name="isDefault" />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Set as default address
            </Label>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full rounded-full" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Save Address
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
