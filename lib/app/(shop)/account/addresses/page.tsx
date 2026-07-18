import { Metadata } from "next";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Addresses | My Account",
};

const MOCK_ADDRESSES = [
  {
    id: "addr-1",
    label: "Home",
    name: "John Doe",
    phone: "+91 9876543210",
    address: "123 Main St, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    name: "John Doe",
    phone: "+91 9876543210",
    address: "Tech Park, Building C, Floor 9",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    isDefault: false,
  }
];

export default function AddressesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">My Addresses</h2>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className={`relative border rounded-2xl p-6 bg-card transition-colors ${addr.isDefault ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}>
            {addr.isDefault && (
              <div className="absolute top-4 right-4 text-primary flex items-center text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Default
              </div>
            )}
            
            <div className="mb-4">
              <span className="inline-block px-2.5 py-1 bg-muted text-xs font-semibold rounded-md mb-3 uppercase tracking-wider">
                {addr.label}
              </span>
              <h3 className="text-lg font-bold">{addr.name}</h3>
              <p className="text-sm font-medium mt-1">{addr.phone}</p>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6 h-16">
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.state} {addr.pincode}</p>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
