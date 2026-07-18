import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package, Truck, Download, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} | My Account`,
  };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Mock data
  if (id !== "NC-202401-001") {
    // We just pretend all other IDs are valid for demo purposes
  }

  const order = {
    id: id,
    date: "Jan 1, 2024",
    status: "Delivered",
    paymentMethod: "Credit Card (Ending in 4242)",
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    items: [
      {
        id: "item-1",
        name: "Apple iPhone 15 Pro Max",
        variant: "Natural Titanium, 256GB",
        price: 159900,
        quantity: 1,
        image: "https://picsum.photos/seed/iphone1/200/200"
      }
    ],
    subtotal: 159900,
    shipping: 0,
    tax: 0,
    total: 159900
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-3">
          <Link href="/account/orders"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders</Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Order #{order.id}</h2>
            <p className="text-muted-foreground">Placed on {order.date}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Invoice</Button>
            <Button variant="outline"><HelpCircle className="w-4 h-4 mr-2" /> Support</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-primary" /> Delivery Status
            </h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
              
              <div className="relative flex gap-4 pb-8">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shadow-sm border-4 border-card flex-shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold">Order Placed</h4>
                  <p className="text-sm text-muted-foreground">Jan 1, 10:00 AM</p>
                </div>
              </div>
              
              <div className="relative flex gap-4 pb-8">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shadow-sm border-4 border-card flex-shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold">Shipped</h4>
                  <p className="text-sm text-muted-foreground">Jan 2, 02:30 PM</p>
                </div>
              </div>
              
              <div className="relative flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 shadow-sm border-4 border-card flex-shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-green-600">Delivered</h4>
                  <p className="text-sm text-muted-foreground">Jan 3, 11:45 AM</p>
                  <p className="text-sm mt-2 font-medium">Package was handed directly to resident.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Items */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" /> Items Ordered
            </h3>
            
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted border flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <span className="font-bold">₹{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                    <p className="text-sm mt-2">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          {/* Summary */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Included</span>
              </div>
            </div>
            
            <Separator className="mb-4" />
            
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{order.total.toLocaleString()}</span>
            </div>
            
            <Button className="w-full">Buy Again</Button>
          </div>
          
          {/* Shipping Info */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="font-bold mb-4">Shipping Address</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="font-bold mb-4">Payment Method</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
