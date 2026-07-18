"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Mock Cart Data
const INITIAL_CART = [
  {
    id: "cart-item-1",
    productId: "prod-1",
    name: "Apple iPhone 15 Pro Max",
    variant: "Natural Titanium, 256GB",
    price: 159900,
    image: "https://picsum.photos/seed/iphone1/200/200",
    quantity: 1,
  },
  {
    id: "cart-item-2",
    productId: "prod-2",
    name: "Sony WH-1000XM5 Wireless Headphones",
    variant: "Black",
    price: 29990,
    image: "https://picsum.photos/seed/sony/200/200",
    quantity: 1,
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState("");

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 500;
  const discount = 0; // Would be calculated based on coupon
  const total = subtotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you love.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart ({cartItems.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-card">
              <div className="relative w-full sm:w-28 sm:h-28 aspect-square rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/product/${item.productId}`} className="font-semibold text-base sm:text-lg hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground mt-1">{item.variant}</p>
                    )}
                  </div>
                  <p className="font-bold whitespace-nowrap ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 sm:mt-auto pt-4 border-t sm:border-none sm:pt-0">
                  <div className="flex items-center border rounded-md bg-background">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="flex items-center text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-card sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Separator className="mb-4" />

            <div className="flex justify-between items-end mb-8">
              <span className="font-semibold text-base">Total</span>
              <div className="text-right">
                <span className="font-bold text-2xl">₹{total.toLocaleString()}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Coupon input */}
            <div className="flex gap-2 mb-8">
              <Input 
                placeholder="Coupon code" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="bg-background"
              />
              <Button variant="secondary">Apply</Button>
            </div>

            <Button className="w-full h-12 text-base font-semibold shadow-md group">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
