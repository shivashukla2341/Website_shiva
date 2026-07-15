"use client";

import { useTransition } from "react";
import { Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/account/actions";
import type { Tables } from "@/types/database";

export function AddressList({ addresses }: { addresses: Tables<"addresses">[] }) {
  const [isPending, startTransition] = useTransition();

  if (addresses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        You haven&apos;t added any addresses yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <Card key={address.id}>
          <CardContent className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{address.full_name}</p>
                <Badge variant="secondary" className="capitalize">
                  {address.type}
                </Badge>
                {address.is_default && <Badge>Default</Badge>}
              </div>
              <div className="flex gap-1">
                {!address.is_default && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    aria-label="Set as default"
                    onClick={() =>
                      startTransition(async () => {
                        await setDefaultAddressAction(address.id, address.type);
                      })
                    }
                  >
                    <Star className="size-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  aria-label="Delete address"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteAddressAction(address.id);
                    })
                  }
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
