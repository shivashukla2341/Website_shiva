import { MessageCircle } from "lucide-react";

import type { ProductQuestion } from "@/lib/data/products";

export function QnaSection({ questions }: { questions: ProductQuestion[] }) {
  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No questions yet. Sign in to ask the community or seller a question.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="border-b border-border/60 pb-6 last:border-0">
          <div className="flex items-start gap-2">
            <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{q.question}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {q.profiles?.full_name ?? "Anonymous"} &middot;{" "}
                {new Date(q.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          {q.product_answers.length > 0 && (
            <div className="mt-3 ml-6 space-y-3 border-l-2 border-border/60 pl-4">
              {q.product_answers.map((a) => (
                <div key={a.id}>
                  <p className="text-sm text-muted-foreground">{a.answer}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.is_seller_answer ? "Seller" : a.profiles?.full_name ?? "Anonymous"} &middot;{" "}
                    {new Date(a.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
