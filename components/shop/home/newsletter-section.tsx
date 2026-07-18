"use client";
import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("You're subscribed! 🎉");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 gradient-bg">
      <div className="container mx-auto px-4 text-center text-white">
        <div className="mx-auto max-w-xl">
          <Mail className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Stay in the Loop</h2>
          <p className="mt-3 text-white/80 text-base">
            Get exclusive deals, new arrivals, and personalized recommendations straight to your inbox.
          </p>
          {done ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-white">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold">You&apos;re subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-md mx-auto">
              <Input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 flex-1 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white"
              />
              <Button type="submit" disabled={loading}
                className="h-11 bg-white text-primary hover:bg-white/90 font-semibold px-6 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-white/60">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </div>
      </div>
    </section>
  );
}
