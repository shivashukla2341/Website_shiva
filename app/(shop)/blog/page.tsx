import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | NexCart",
  description: "Read the latest news, tips, and guides from NexCart.",
};

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Ultimate Guide to Choosing the Right Smartphone in 2024",
    excerpt: "Discover the key features you should look for when upgrading your phone this year, from camera quality to battery life.",
    date: "Jan 15, 2024",
    author: "Alex Johnson",
    image: "https://picsum.photos/seed/blog1/800/500",
    category: "Technology",
  },
  {
    id: 2,
    title: "10 Minimalist Home Decor Ideas for a Calmer Space",
    excerpt: "Transform your living space with these simple, elegant, and affordable minimalist decor tips.",
    date: "Jan 10, 2024",
    author: "Sarah Smith",
    image: "https://picsum.photos/seed/blog2/800/500",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "Understanding Sustainable Fashion: Why It Matters",
    excerpt: "Learn how your clothing choices impact the environment and how to build a sustainable wardrobe.",
    date: "Jan 5, 2024",
    author: "Emma Davis",
    image: "https://picsum.photos/seed/blog3/800/500",
    category: "Fashion",
  },
  {
    id: 4,
    title: "Top 5 Fitness Gadgets to Boost Your Workout Routine",
    excerpt: "Track your progress and stay motivated with these must-have fitness accessories.",
    date: "Jan 2, 2024",
    author: "Mike Wilson",
    image: "https://picsum.photos/seed/blog4/800/500",
    category: "Health & Fitness",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">NexCart Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, guides, and stories to help you make the most of your shopping experience.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16 group cursor-pointer">
        <div className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-6">
          <Image src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {BLOG_POSTS[0].category}
            </span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> {BLOG_POSTS[0].author}</span>
            <span>•</span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {BLOG_POSTS[0].date}</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{BLOG_POSTS[0].title}</h2>
          <p className="text-lg text-muted-foreground mb-6 line-clamp-2">{BLOG_POSTS[0].excerpt}</p>
          <Link href={`/blog/${BLOG_POSTS[0].id}`} className="inline-flex items-center font-semibold text-primary hover:underline">
            Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Posts Grid */}
      <h3 className="text-2xl font-bold mb-8">Recent Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.slice(1).map((post) => (
          <div key={post.id} className="group cursor-pointer flex flex-col h-full bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-video overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 left-3">
                <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {post.author}</span>
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {post.date}</span>
              </div>
              <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
              <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
              <Link href={`/blog/${post.id}`} className="inline-flex items-center font-semibold text-sm text-primary group-hover:underline mt-auto">
                Read More <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
