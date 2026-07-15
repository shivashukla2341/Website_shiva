import { AddressList } from "@/components/account/address-list";
import { AddAddressDialog } from "@/components/account/add-address-dialog";
import { requireUser } from "@/lib/security/authorize";
import { createClient } from "@/lib/supabase/server";

export default async function AddressesPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <AddAddressDialog />
      </div>

      <AddressList addresses={addresses ?? []} />
    </div>
  );
}
