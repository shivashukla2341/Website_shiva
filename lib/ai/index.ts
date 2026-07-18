// =============================================================================
// NEXCART — AI FEATURES
// Product Recommendations, Smart Search, Chat Support
// =============================================================================

import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
});

// ─── Generate Product Embedding ──────────────────────────────────────────────

export async function generateProductEmbedding(
  text: string
): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  });
  return response.data[0].embedding;
}

// ─── AI Product Recommendations (Vector Similarity) ──────────────────────────

export async function getAIRecommendations(
  productId: string,
  limit = 6
): Promise<unknown[]> {
  const supabase = createAdminClient();

  // Get target product embedding
  const { data: product } = await supabase
    .from("products")
    .select("embedding, name, category_id, tags")
    .eq("id", productId)
    .single();

  if (!product?.embedding) return [];

  // Vector similarity search using pgvector
  const { data: similar } = await supabase.rpc("get_similar_products", {
    query_embedding: product.embedding,
    target_product_id: productId,
    match_count: limit,
    match_threshold: 0.7,
  });

  return similar ?? [];
}

// ─── AI Search Suggestions ────────────────────────────────────────────────────

export async function getAISearchSuggestions(
  query: string
): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a smart e-commerce search assistant. Given a partial search query, return 5 relevant product search suggestions as a JSON array of strings. Be concise and relevant. Return ONLY the JSON array.",
      },
      {
        role: "user",
        content: `Partial query: "${query}"\nReturn 5 search suggestions for an Indian e-commerce platform.`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 100,
    temperature: 0.3,
  });

  try {
    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content ?? "{}");
    return Array.isArray(parsed.suggestions)
      ? parsed.suggestions.slice(0, 5)
      : [];
  } catch {
    return [];
  }
}

// ─── AI Review Summary ────────────────────────────────────────────────────────

export async function generateReviewSummary(
  reviews: { rating: number; body: string }[]
): Promise<string> {
  if (reviews.length < 3) return "";

  const reviewTexts = reviews
    .slice(0, 20) // Limit to 20 reviews
    .map((r) => `[${r.rating}/5] ${r.body}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a product review analyst. Summarize customer reviews in 2-3 sentences highlighting pros, cons, and overall sentiment. Be factual and concise.",
      },
      {
        role: "user",
        content: `Summarize these customer reviews:\n\n${reviewTexts}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.3,
  });

  return completion.choices[0].message.content ?? "";
}

// ─── AI Chat Support ──────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function getAIChatResponse(
  messages: ChatMessage[],
  context?: {
    currentPage?: string;
    cartItems?: number;
    recentOrders?: string[];
  }
): Promise<string> {
  const systemPrompt = `You are NexBot, a helpful and friendly AI shopping assistant for NexCart, an Indian e-commerce platform.

Your capabilities:
- Help customers find products
- Answer questions about orders, shipping, returns
- Provide product recommendations
- Help with account issues
- Answer FAQs

Context:
${context?.currentPage ? `- Customer is on: ${context.currentPage}` : ""}
${context?.cartItems ? `- Cart has ${context.cartItems} items` : ""}
${context?.recentOrders?.length ? `- Recent order IDs: ${context.recentOrders.join(", ")}` : ""}

Store Policies:
- Free shipping on orders ₹499+
- 7-day hassle-free returns
- Delivery in 2-7 business days
- Support: support@nexcart.com | +91-9999-999-999

Be helpful, concise, and friendly. Use emojis sparingly for warmth.
If you can't help, direct them to support@nexcart.com.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  return (
    completion.choices[0].message.content ??
    "I'm sorry, I couldn't process your request. Please try again."
  );
}

// ─── Supabase RPC for Vector Search (create this in your migration) ───────────
/*
CREATE OR REPLACE FUNCTION get_similar_products(
  query_embedding VECTOR(1536),
  target_product_id UUID,
  match_count INT DEFAULT 6,
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price NUMERIC,
  average_rating NUMERIC,
  review_count INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.name, p.slug, p.price, p.average_rating, p.review_count,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM products p
  WHERE
    p.id != target_product_id
    AND p.status = 'active'
    AND p.embedding IS NOT NULL
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
*/
