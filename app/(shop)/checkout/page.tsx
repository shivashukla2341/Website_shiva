"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CreditCard, Wallet, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Mock Cart Data
const CART_ITEMS = [
  {
    id: "cart-item-1",
    productId: "prod-1",
    name: "Apple iPhone 15 Pro Max",
    variant: "Natural Titanium, 256GB",
    price: 159900,
    image: "https://picsum.photos/seed/iphone1/200/200",
    quantity: 1,
  }
];

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-center mb-8 md:mb-12">
        <h1 className="text-2xl font-bold tracking-tight sr-only">Checkout</h1>
        
        {/* Progress Tracker */}
        <div className="flex items-center w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Shipping</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Payment</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Review</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Shipping Address */}
          <div className={`border rounded-xl p-6 bg-card transition-all ${step !== 1 && 'opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" /> 
                Shipping Address
              </h2>
              {step > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
              )}
            </div>
            
            {step === 1 ? (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address line 1</Label>
                  <Input id="address" placeholder="123 Main St" required />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="MH" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">PIN Code</Label>
                    <Input id="zip" placeholder="400001" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" required />
                </div>
                
                <Button type="submit" className="w-full sm:w-auto mt-6">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <div className="text-sm">
                <p className="font-medium">John Doe</p>
                <p className="text-muted-foreground mt-1">123 Main St, Mumbai, MH 400001</p>
                <p className="text-muted-foreground">+91 9876543210</p>
              </div>
            )}
          </div>
          
          {/* Step 2: Payment Method */}
          <div className={`border rounded-xl p-6 bg-card transition-all ${(step < 2) && 'opacity-50 pointer-events-none'} ${step === 3 && 'opacity-60 grayscale-[0.5]'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" /> 
                Payment Method
              </h2>
              {step > 2 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
              )}
            </div>
            
            {step === 2 ? (
              <div className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {/* Card Payment */}
                  <div className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setPaymentMethod('card')}>
                    <RadioGroupItem value="card" id="card" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="card" className="font-semibold text-base cursor-pointer">Credit / Debit Card</Label>
                      <p className="text-sm text-muted-foreground mt-1">Pay securely with Visa, Mastercard, or Amex</p>
                      
                      {paymentMethod === 'card' && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" type="password" placeholder="123" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input id="nameOnCard" placeholder="John Doe" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* UPI */}
                  <div className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setPaymentMethod('upi')}>
                    <RadioGroupItem value="upi" id="upi" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="upi" className="font-semibold text-base cursor-pointer">UPI</Label>
                      <p className="text-sm text-muted-foreground mt-1">Google Pay, PhonePe, Paytm, etc.</p>
                    </div>
                  </div>
                  
                  {/* COD */}
                  <div className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setPaymentMethod('cod')}>
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="font-semibold text-base cursor-pointer">Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground mt-1">Pay with cash when your order is delivered</p>
                    </div>
                  </div>
                </RadioGroup>
                
                <Button onClick={() => setStep(3)} className="w-full sm:w-auto mt-6">
                  Review Order
                </Button>
              </div>
            ) : step === 3 ? (
              <div className="text-sm">
                <p className="font-medium capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
                {paymentMethod === 'card' && <p className="text-muted-foreground mt-1">Ending in 4242</p>}
              </div>
            ) : null}
          </div>
          
        </div>

        {/* Order Summary & Review */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-card sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {CART_ITEMS.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] rounded-full z-10 font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2 leading-tight">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
                    <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            <div className="space-y-3 text-sm mb-6">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span className="font-medium">Included</span>
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="flex justify-between items-end mb-8">
              <span className="font-semibold text-base">Total</span>
              <span className="font-bold text-2xl">₹{total.toLocaleString()}</span>
            </div>

            <Button 
              className="w-full h-12 text-base font-semibold shadow-md gradient-bg text-white hover:opacity-90"
              disabled={step !== 3}
            >
              {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
            </Button>

            <div className="mt-6 flex flex-col items-center gap-3 text-xs text-muted-foreground text-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure SSL encrypted payment</span>
              </div>
              <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
