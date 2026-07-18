import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | NexCart",
  description: "Learn about our shipping and delivery processes.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto bg-card border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Shipping Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on Sundays or public holidays.
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>

          <h2>2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul>
            <li><strong>Standard Shipping:</strong> 3-5 business days (Free for orders over ₹50,000)</li>
            <li><strong>Express Shipping:</strong> 1-2 business days (₹500 flat rate)</li>
          </ul>

          <h2>3. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). 
            The tracking number will be active within 24 hours.
          </p>

          <h2>4. Damages</h2>
          <p>
            NexCart is not liable for any products damaged or lost during shipping. If you received your order damaged, 
            please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </div>
      </div>
    </div>
  );
}
