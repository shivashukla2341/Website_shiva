import { Metadata } from "next";
import { Briefcase, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | NexCart",
  description: "Join our team and help us build the future of e-commerce.",
};

const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote / Mumbai",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Mumbai",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Customer Success Specialist",
    department: "Support",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 4,
    title: "Performance Marketing Lead",
    department: "Marketing",
    location: "Mumbai",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Build the Future of Commerce</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          We're looking for passionate individuals to join our mission of creating the world's most customer-centric shopping platform.
        </p>
        <Button size="lg" className="rounded-full px-8">
          View Open Roles
        </Button>
      </div>

      {/* Culture / Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="bg-primary/5 p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Fast-paced Growth</h3>
          <p className="text-sm text-muted-foreground">Work on challenging problems at scale and accelerate your career trajectory.</p>
        </div>
        <div className="bg-primary/5 p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold mb-2">Health & Wellness</h3>
          <p className="text-sm text-muted-foreground">Comprehensive health insurance, mental health support, and gym allowances.</p>
        </div>
        <div className="bg-primary/5 p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-2">Work from Anywhere</h3>
          <p className="text-sm text-muted-foreground">Flexible remote work policies allowing you to work from where you're most productive.</p>
        </div>
      </div>

      {/* Openings */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
        <div className="flex flex-col gap-4">
          {OPEN_POSITIONS.map((job) => (
            <Link key={job.id} href={`/careers/${job.id}`} className="group block">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border rounded-2xl hover:border-primary transition-colors">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.department}</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium text-foreground">{job.type}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                    Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
