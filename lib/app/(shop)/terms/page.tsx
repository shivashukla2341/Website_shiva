import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NexCart",
  description: "Terms and conditions for using NexCart.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto bg-card border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Terms</h2>
          <p>
            By accessing this Website, accessible from nexcart.com, you are agreeing to be bound by these 
            Website Terms and Conditions of Use and agree that you are responsible for the agreement with 
            any applicable local laws.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on NexCart's Website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on NexCart's Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            All the materials on NexCart's Website are provided "as is". NexCart makes no warranties, may it be expressed or implied, 
            therefore negates all other warranties. Furthermore, NexCart does not make any representations concerning the accuracy or reliability 
            of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
          </p>

          <h2>4. Limitations</h2>
          <p>
            NexCart or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials 
            on NexCart's Website, even if NexCart or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
          </p>

          <h2>5. Revisions and Errata</h2>
          <p>
            The materials appearing on NexCart's Website may include technical, typographical, or photographic errors. 
            NexCart will not promise that any of the materials in this Website are accurate, complete, or current. 
            NexCart may change the materials contained on its Website at any time without notice.
          </p>
        </div>
      </div>
    </div>
  );
}
